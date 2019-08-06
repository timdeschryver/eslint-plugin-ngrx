import { TSESTree } from '@typescript-eslint/experimental-utils'

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === 'Identifier'
}
