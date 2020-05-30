import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/experimental-utils'

export const docsUrl = (ruleName: string) =>
  `https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/${ruleName}.md`

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === AST_NODE_TYPES.Identifier
}

export function isLiteral(node: TSESTree.Node): node is TSESTree.Literal {
  return node.type === AST_NODE_TYPES.Literal
}
