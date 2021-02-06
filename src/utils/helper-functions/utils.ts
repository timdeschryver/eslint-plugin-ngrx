import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import {
  isCallExpression,
  isClassDeclaration,
  isImportDeclaration,
  isImportSpecifier,
  isProgram,
} from './guards'

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
    return node.body.find(
      (node) => isImportDeclaration(node) && node.source.value === module,
    ) as TSESTree.ImportDeclaration | undefined
  }
  if (!node.parent) return undefined
  return findImportDeclarationNode(node.parent, module)
}

export function getConditionalImportFix(
  fixer: TSESLint.RuleFixer,
  importDeclaration: TSESTree.ImportDeclaration | undefined,
  importSpecifier: string,
  modulePath: string,
): TSESLint.RuleFix[] {
  if (importDeclaration && hasImport(importDeclaration, importSpecifier)) {
    return []
  }

  if (!importDeclaration?.specifiers.length) {
    return [
      fixer.insertTextAfterRange(
        [0, 0],
        `import { ${importSpecifier} } from '${modulePath}';\n`,
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
