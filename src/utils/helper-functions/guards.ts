import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/experimental-utils'

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === AST_NODE_TYPES.Identifier
}

export function isLiteral(node: TSESTree.Node): node is TSESTree.Literal {
  return node.type === AST_NODE_TYPES.Literal
}

export function isCallExpression(
  node: TSESTree.Node,
): node is TSESTree.CallExpression {
  return node.type === AST_NODE_TYPES.CallExpression
}

export function isMemberExpression(
  node: TSESTree.Node,
): node is TSESTree.MemberExpression {
  return node.type === AST_NODE_TYPES.MemberExpression
}

export function isArrowFunctionExpression(
  node: TSESTree.Node,
): node is TSESTree.ArrowFunctionExpression {
  return node.type === AST_NODE_TYPES.ArrowFunctionExpression
}

export function isFunctionExpression(
  node: TSESTree.Node,
): node is TSESTree.FunctionExpression {
  return node.type === AST_NODE_TYPES.FunctionExpression
}

export function isFunctionLike(
  node: TSESTree.Node,
): node is TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression {
  return isArrowFunctionExpression(node) || isFunctionExpression(node)
}

export function isClassDeclaration(
  node: TSESTree.Node,
): node is TSESTree.ClassDeclaration {
  return node.type === AST_NODE_TYPES.ClassDeclaration
}

export function isExpressionStatement(
  node: TSESTree.Node,
): node is TSESTree.ExpressionStatement {
  return node.type === AST_NODE_TYPES.ExpressionStatement
}

export function isImportDeclaration(
  node: TSESTree.Node,
): node is TSESTree.ImportDeclaration {
  return node.type === 'ImportDeclaration'
}

export function isImportSpecifier(
  node: TSESTree.Node,
): node is TSESTree.ImportSpecifier {
  return node.type === 'ImportSpecifier'
}

export function isProgram(node: TSESTree.Node): node is TSESTree.Program {
  return node.type === 'Program'
}
