import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import {
  isCallExpression,
  isIdentifier,
  isIdentifierOrMemberExpression,
  isImportDeclaration,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isImportSpecifier,
  isProgram,
  isTSTypeAnnotation,
  isTSTypeReference,
} from './guards'

export const MODULE_PATHS = {
  componentStore: '@ngrx/component-store',
  effects: '@ngrx/effects',
  store: '@ngrx/store',
} as const

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
  importName: string,
) {
  for (const importDeclaration of importDeclarations) {
    const importSpecifier = importDeclaration.specifiers.find(
      (importClause): importClause is TSESTree.ImportSpecifier => {
        return (
          isImportSpecifier(importClause) &&
          importClause.imported.name === importName
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

function getCorrespondentImportClause(
  importDeclarations: readonly TSESTree.ImportDeclaration[],
  compatibleWithTypeOnlyImport = false,
) {
  let importClause: TSESTree.ImportClause | undefined

  for (const { importKind, specifiers } of importDeclarations) {
    const lastImportSpecifier = getLast(specifiers)

    if (
      (!compatibleWithTypeOnlyImport && importKind === 'type') ||
      isImportNamespaceSpecifier(lastImportSpecifier)
    ) {
      continue
    }

    importClause = lastImportSpecifier
  }

  return importClause
}

export function getImportAddFix({
  compatibleWithTypeOnlyImport = false,
  fixer,
  importName,
  moduleName,
  node,
}: {
  compatibleWithTypeOnlyImport?: boolean
  fixer: TSESLint.RuleFixer
  importName: string
  moduleName: string
  node: TSESTree.Node
}): TSESLint.RuleFix | TSESLint.RuleFix[] {
  const fullImport = `import { ${importName} } from '${moduleName}';\n`
  const importDeclarations = getImportDeclarations(node, moduleName)

  if (!importDeclarations?.length) {
    return fixer.insertTextAfterRange([0, 0], fullImport)
  }

  const importDeclarationSpecifier = getImportDeclarationSpecifier(
    importDeclarations,
    importName,
  )

  if (importDeclarationSpecifier) {
    return []
  }

  const importClause = getCorrespondentImportClause(
    importDeclarations,
    compatibleWithTypeOnlyImport,
  )

  if (!importClause) {
    return fixer.insertTextAfterRange([0, 0], fullImport)
  }

  const replacementText = isImportDefaultSpecifier(importClause)
    ? `, { ${importName} }`
    : `, ${importName}`
  return fixer.insertTextAfter(importClause, replacementText)
}

export function getInterfaceName(
  interfaceMember: TSESTree.Identifier | TSESTree.MemberExpression,
): string | undefined {
  if (isIdentifier(interfaceMember)) {
    return interfaceMember.name
  }

  return isIdentifier(interfaceMember.property)
    ? interfaceMember.property.name
    : undefined
}

export function getInterfaces({
  implements: classImplements,
}: TSESTree.ClassDeclaration): readonly (
  | TSESTree.Identifier
  | TSESTree.MemberExpression
)[] {
  return (classImplements ?? [])
    .map(({ expression }) => expression)
    .filter(isIdentifierOrMemberExpression)
}

export function getInterface(
  node: TSESTree.ClassDeclaration,
  interfaceName: string,
): TSESTree.Identifier | TSESTree.MemberExpression | undefined {
  return getInterfaces(node).find(
    (interfaceMember) => getInterfaceName(interfaceMember) === interfaceName,
  )
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
  importName: string,
): string | undefined {
  const { ast } = context.getSourceCode()
  const importDeclarations = getImportDeclarations(ast, moduleName) ?? []
  const { importSpecifier } =
    getImportDeclarationSpecifier(importDeclarations, importName) ?? {}

  if (!importSpecifier) {
    return undefined
  }

  const variables = context.getDeclaredVariables(importSpecifier)
  const typedVariable = variables.find(({ name }) => name === importName)

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
