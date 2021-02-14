import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { couldBeType } from 'tsutils-etc'

function getParserServices(
  context: TSESLint.RuleContext<string, readonly unknown[]>,
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
  context: TSESLint.RuleContext<string, readonly unknown[]>,
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
