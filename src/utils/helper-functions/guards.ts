import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils'
import type ts from 'typescript'

const isNodeOfType =
  <NodeType extends AST_NODE_TYPES>(nodeType: NodeType) =>
  (node: TSESTree.Node): node is TSESTree.Node & { type: NodeType } =>
    node.type === nodeType

export const isArrowFunctionExpression = isNodeOfType(
  AST_NODE_TYPES.ArrowFunctionExpression,
)
export const isCallExpression = isNodeOfType(AST_NODE_TYPES.CallExpression)
export const isClassDeclaration = isNodeOfType(AST_NODE_TYPES.ClassDeclaration)
export const isExpressionStatement = isNodeOfType(
  AST_NODE_TYPES.ExpressionStatement,
)
export const isFunctionExpression = isNodeOfType(
  AST_NODE_TYPES.FunctionExpression,
)
export const isIdentifier = isNodeOfType(AST_NODE_TYPES.Identifier)
export const isImportDeclaration = isNodeOfType(
  AST_NODE_TYPES.ImportDeclaration,
)
export const isImportDefaultSpecifier = isNodeOfType(
  AST_NODE_TYPES.ImportDefaultSpecifier,
)
export const isImportNamespaceSpecifier = isNodeOfType(
  AST_NODE_TYPES.ImportNamespaceSpecifier,
)
export const isImportSpecifier = isNodeOfType(AST_NODE_TYPES.ImportSpecifier)
export const isLiteral = isNodeOfType(AST_NODE_TYPES.Literal)
export const isMemberExpression = isNodeOfType(AST_NODE_TYPES.MemberExpression)
export const isProgram = isNodeOfType(AST_NODE_TYPES.Program)
export const isTSParameterProperty = isNodeOfType(
  AST_NODE_TYPES.TSParameterProperty,
)
export const isTSTypeAnnotation = isNodeOfType(AST_NODE_TYPES.TSTypeAnnotation)
export const isTSTypeReference = isNodeOfType(AST_NODE_TYPES.TSTypeReference)
export const isObjectExpression = isNodeOfType(AST_NODE_TYPES.ObjectExpression)
export const isProperty = isNodeOfType(AST_NODE_TYPES.Property)

export function isIdentifierOrMemberExpression(
  node: TSESTree.Node,
): node is TSESTree.Identifier | TSESTree.MemberExpression {
  return isIdentifier(node) || isMemberExpression(node)
}

export function isTypeReference(type: ts.Type): type is ts.TypeReference {
  return type.hasOwnProperty('target')
}
