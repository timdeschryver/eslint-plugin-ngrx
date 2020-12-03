import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/experimental-utils'

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node && node.type === AST_NODE_TYPES.Identifier
}

export function isLiteral(node: TSESTree.Node): node is TSESTree.Literal {
  return node && node.type === AST_NODE_TYPES.Literal
}

export function isCallExpression(
  node: TSESTree.Node,
): node is TSESTree.CallExpression {
  return node && node.type === AST_NODE_TYPES.CallExpression
}

export function isMemberExpression(
  node: TSESTree.Node,
): node is TSESTree.MemberExpression {
  return node && node.type === AST_NODE_TYPES.MemberExpression
}

export function isArrowFunctionExpression(
  node: TSESTree.Node,
): node is TSESTree.ArrowFunctionExpression {
  return node && node.type === AST_NODE_TYPES.ArrowFunctionExpression
}

export function isClassDeclaration(
  node: TSESTree.Node,
): node is TSESTree.ClassDeclaration {
  return node && node.type === AST_NODE_TYPES.ClassDeclaration
}
