import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import {
  isCallExpression,
  isClassDeclaration,
  isIdentifier,
  isImportDeclaration,
  isImportSpecifier,
  isProgram,
  isTSTypeAnnotation,
  isTSTypeReference,
} from './guards'

export const MODULE_PATHS = {
  effects: '@ngrx/effects',
}

export function findClassDeclarationNode(
  node: TSESTree.Node,
): TSESTree.ClassDeclaration | null {
  if (isClassDeclaration(node)) {
    return node
  }
  if (!node.parent) return null
  return findClassDeclarationNode(node.parent)
}

export function findImportDeclarationNode(
  node: TSESTree.Node,
  module: string,
): TSESTree.ImportDeclaration | undefined {
  if (isProgram(node)) {
    return (node.body || []).find(
      (node) => isImportDeclaration(node) && node.source.value === module,
    ) as TSESTree.ImportDeclaration | undefined
  }
  if (!node.parent) return undefined
  return findImportDeclarationNode(node.parent, module)
}

export function getConditionalImportFix(
  fixer: TSESLint.RuleFixer,
  node: TSESTree.Node,
  importSpecifier: string,
  module: string,
): TSESLint.RuleFix[] {
  const importDeclaration = findImportDeclarationNode(node, module)
  if (importDeclaration && hasImport(importDeclaration, importSpecifier)) {
    return []
  }

  if (!importDeclaration?.specifiers.length) {
    return [
      fixer.insertTextAfterRange(
        [0, 0],
        `import { ${importSpecifier} } from '${module}';\n`,
      ),
    ]
  }

  const lastImportSpecifier = getLast(importDeclaration.specifiers)

  return [fixer.insertTextAfter(lastImportSpecifier, `, ${importSpecifier}`)]
}

export function getImplementsSchemaFixer(
  { id, implements: implementz }: TSESTree.ClassDeclaration,
  interfaceName: string,
) {
  const [implementsNodeReplace, implementsTextReplace] = implementz
    ? [getLast(implementz), `, ${interfaceName}`]
    : [id as TSESTree.Identifier, ` implements ${interfaceName}`]

  return { implementsNodeReplace, implementsTextReplace } as const
}

export function getLast<T extends readonly unknown[]>(items: T): T[number] {
  return items.slice(-1)[0]
}

export function hasImport(
  { specifiers }: TSESTree.ImportDeclaration,
  importSpecifier: string,
): boolean {
  return specifiers
    .filter(isImportSpecifier)
    .some(({ imported: { name } }) => name === importSpecifier)
}

export function getDecoratorArgument({ expression }: TSESTree.Decorator) {
  return isCallExpression(expression) && expression.arguments.length > 0
    ? expression.arguments[0]
    : undefined
}

export function findNgRxStoreName(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): string | undefined {
  const { ast } = context.getSourceCode()
  const storeImportSpecifier = findImportDeclarationNode(ast, '@ngrx/store')

  if (!storeImportSpecifier) return undefined

  const variables = context.getDeclaredVariables(storeImportSpecifier)
  const storeVariable = variables.find((v) => v.name === 'Store')

  if (!storeVariable) return undefined

  return storeVariable.references
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

export function findNgRxComponentStoreName(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): string | undefined {
  const { ast } = context.getSourceCode()
  const storeImportSpecifier = findImportDeclarationNode(
    ast,
    '@ngrx/component-store',
  )

  if (!storeImportSpecifier) return undefined

  const variables = context.getDeclaredVariables(storeImportSpecifier)
  const storeVariable = variables.find((v) => v.name === 'ComponentStore')

  if (!storeVariable) return undefined

  return storeVariable.references
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

export function findNgRxEffectActionsName(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): string | undefined {
  const { ast } = context.getSourceCode()
  const effectsImportSpecifier = findImportDeclarationNode(ast, '@ngrx/effects')
  if (!effectsImportSpecifier) return undefined

  const variables = context.getDeclaredVariables(effectsImportSpecifier)
  const actionsVariable = variables.find((v) => v.name === 'Actions')

  if (!actionsVariable) return undefined

  return actionsVariable.references
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
