import { TSESTree } from '@typescript-eslint/experimental-utils'
import { isClassDeclaration } from './guards'

export function findClassDeclarationNode(
  node: TSESTree.Node,
): TSESTree.ClassDeclaration | null {
  if (isClassDeclaration(node)) {
    return node
  }
  if (!node.parent) return null
  return findClassDeclarationNode(node.parent)
}
