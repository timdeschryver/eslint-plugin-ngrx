import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/experimental-utils'
import { couldBeType } from 'tsutils-etc'

export const docsUrl = (ruleName: string) =>
  `https://github.com/timdeschryver/eslint-plugin-ngrx/tree/master/docs/rules/${ruleName}.md`

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === AST_NODE_TYPES.Identifier
}

export function isLiteral(node: TSESTree.Node): node is TSESTree.Literal {
  return node.type === AST_NODE_TYPES.Literal
}

function getParserServices(
  // RuleContext<string, readonly unknown[]>>
  context: Readonly<any>,
) {
  if (
    !context.parserServices ||
    !context.parserServices.program ||
    !context.parserServices.esTreeNodeToTSNodeMap
  ) {
    throw new Error(
      'This rule requires you to use `@typescript-eslint/parser` and to specify a `project` in `parserOptions`.',
    )
  }
  return context.parserServices
}

export function typecheck(
  // RuleContext<string, readonly unknown[]>>
  context: Readonly<any>,
) {
  const service = getParserServices(context)
  const nodeMap = service.esTreeNodeToTSNodeMap
  const typeChecker = service.program.getTypeChecker()

  const getTSType = (node: TSESTree.Node) => {
    const tsNode = nodeMap.get(node)
    return typeChecker.getTypeAtLocation(tsNode)
  }

  const couldBeOfType = (
    node: TSESTree.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ) => {
    const tsType = getTSType(node)
    return couldBeType(
      tsType,
      name,
      qualified ? { ...qualified, typeChecker } : undefined,
    )
  }

  return {
    nodeMap,
    typeChecker,
    getTSType,
    couldBeOfType,
  }
}
