import { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import {
  isIdentifier,
  isImportDeclaration,
  isImportSpecifier,
  isTSTypeAnnotation,
  isTSTypeReference,
} from '.'

export const DEFAULT_STORE_NAMES = ['store', 'store$']

export function readNgRxStoreName(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
): string {
  let storeName = ''
  let i = 0
  let node: TSESTree.Node
  const ast = context.getSourceCode().ast
  while (!storeName && (node = ast.body[i++])) {
    if (!isImportDeclaration(node) || node.source.value !== '@ngrx/store')
      continue

    const storeImportSpecifier = node.specifiers
      .map((specifierNode) =>
        isImportSpecifier(specifierNode) &&
        specifierNode.imported.name === 'Store'
          ? specifierNode
          : undefined,
      )
      .find(Boolean)

    if (!storeImportSpecifier) continue

    const [storeImport] = context.getDeclaredVariables(storeImportSpecifier)
    const storeImportName = storeImport.references
      .map((ref) => {
        if (
          ref.identifier.parent &&
          isTSTypeReference(ref.identifier.parent) &&
          ref.identifier.parent.parent &&
          isTSTypeAnnotation(ref.identifier.parent.parent) &&
          ref.identifier.parent.parent.parent &&
          isIdentifier(ref.identifier.parent.parent.parent)
        ) {
          return ref.identifier.parent.parent.parent.name
        }
        return ''
      })
      .find(Boolean)
    storeName = storeImportName || ''
  }

  return storeName
}
