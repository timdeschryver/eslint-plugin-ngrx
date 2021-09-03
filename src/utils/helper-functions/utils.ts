import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils'
import {
  isCallExpression,
  isIdentifier,
  isImportDeclaration,
  isImportSpecifier,
  isProgram,
  isTSTypeAnnotation,
  isTSTypeReference,
} from './guards'

export const MODULE_PATHS = {
  componentStore: '@ngrx/component-store',
  effects: '@ngrx/effects',
  store: '@ngrx/store',
}

export function getNearestUpperNodeFrom<T extends TSESTree.Node>(
  { parent }: TSESTree.Node,
  predicate: (parent: TSESTree.Node) => parent is T,
): T | undefined {
  while (parent && !isProgram(parent)) {
    if (predicate(parent)) {
      return parent
    }

    parent = parent.parent
  }

  return undefined
}

export function getImportDeclarationSpecifier(
  importDeclarations: readonly TSESTree.ImportDeclaration[],
  importedName: string,
) {
  for (const importDeclaration of importDeclarations) {
    const importSpecifier = importDeclaration.specifiers.find(
      (importClause): importClause is TSESTree.ImportSpecifier => {
        return (
          isImportSpecifier(importClause) &&
          importClause.imported.name === importedName
        )
      },
    )

    if (importSpecifier) {
      return { importDeclaration, importSpecifier } as const
    }
  }

  return undefined
}

export function getImportDeclarations(
  node: TSESTree.Node,
  moduleName: string,
): readonly TSESTree.ImportDeclaration[] | undefined {
  let parentNode: TSESTree.Node | undefined = node

  while (parentNode && !isProgram(parentNode)) {
    parentNode = parentNode.parent
  }

  return parentNode?.body.filter(
    (node): node is TSESTree.ImportDeclaration =>
      isImportDeclaration(node) && node.source.value === moduleName,
  )
}

export function getImportAddFix({
  compatibleWithTypeOnlyImport = false,
  fixer,
  importedName,
  moduleName,
  node,
}: {
  compatibleWithTypeOnlyImport?: boolean
  fixer: TSESLint.RuleFixer
  importedName: string
  moduleName: string
  node: TSESTree.Node
}): TSESLint.RuleFix | TSESLint.RuleFix[] {
  const fullImport = `import { ${importedName} } from '${moduleName}';\n`
  const importDeclarations = getImportDeclarations(node, moduleName)

  if (!importDeclarations?.length) {
    return fixer.insertTextAfterRange([0, 0], fullImport)
  }

  const importDeclarationSpecifier = getImportDeclarationSpecifier(
    importDeclarations,
    importedName,
  )

  if (importDeclarationSpecifier) {
    return []
  }

  const [{ importKind, specifiers }] = importDeclarations

  if (!compatibleWithTypeOnlyImport && importKind === 'type') {
    return fixer.insertTextAfterRange([0, 0], fullImport)
  }

  const lastImportSpecifier = getLast(specifiers)

  switch (lastImportSpecifier.type) {
    case AST_NODE_TYPES.ImportDefaultSpecifier:
      return fixer.insertTextAfter(lastImportSpecifier, `, { ${importedName} }`)
    case AST_NODE_TYPES.ImportNamespaceSpecifier:
      return fixer.insertTextAfterRange([0, 0], fullImport)
    default:
      return fixer.insertTextAfter(lastImportSpecifier, `, ${importedName}`)
  }
}

export function getImplementsSchemaFixer(
  { id, implements: classImplements }: TSESTree.ClassDeclaration,
  interfaceName: string,
) {
  const [implementsNodeReplace, implementsTextReplace] = classImplements
    ? [getLast(classImplements), `, ${interfaceName}`]
    : [id as TSESTree.Identifier, ` implements ${interfaceName}`]

  return { implementsNodeReplace, implementsTextReplace } as const
}

export function getLast<T extends readonly unknown[]>(items: T): T[number] {
  return items.slice(-1)[0]
}

export function getDecoratorArgument({ expression }: TSESTree.Decorator) {
  return isCallExpression(expression) && expression.arguments.length > 0
    ? expression.arguments[0]
    : undefined
}

function findCorrespondingNameBy(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
  moduleName: string,
  importedName: string,
): string | undefined {
  const { ast } = context.getSourceCode()
  const importDeclarations = getImportDeclarations(ast, moduleName) ?? []
  const { importSpecifier } =
    getImportDeclarationSpecifier(importDeclarations, importedName) ?? {}

  if (!importSpecifier) {
    return undefined
  }

  const variables = context.getDeclaredVariables(importSpecifier)
  const typedVariable = variables.find(({ name }) => name === importedName)

  return typedVariable?.references
    .map(({ identifier: { parent } }) => {
      if (
        parent &&
        isTSTypeReference(parent) &&
        parent.parent &&
        isTSTypeAnnotation(parent.parent) &&
        parent.parent.parent &&
        isIdentifier(parent.parent.parent)
      ) {
        return parent.parent.parent.name
      }

      return undefined
    })
    .find(Boolean)
}

export function findNgRxStoreName(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): string | undefined {
  return findCorrespondingNameBy(context, MODULE_PATHS.store, 'Store')
}

export function findNgRxComponentStoreName(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): string | undefined {
  return findCorrespondingNameBy(
    context,
    MODULE_PATHS.componentStore,
    'ComponentStore',
  )
}

export function findNgRxEffectActionsName(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): string | undefined {
  return findCorrespondingNameBy(context, MODULE_PATHS.effects, 'Actions')
}
