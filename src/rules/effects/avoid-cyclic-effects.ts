import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import { getTypeServices } from 'eslint-etc'
import path from 'path'
import ts from 'typescript'
import {
  createEffectExpression,
  docsUrl,
  findNgRxEffectActionsName,
  isCallExpression,
  isIdentifier,
  isTypeReference,
  storePipe,
} from '../../utils'

export const messageId = 'avoidCyclicEffects'

type MessageIds = typeof messageId
type Options = []

// This rule is a modified version (to support dispatch: false) from the eslint-plugin-rxjs plugin.
// The original implementation can be found at https://github.com/cartant/eslint-plugin-rxjs/blob/main/source/rules/no-cyclic-action.ts
// Thank you Nicholas Jamieson (@cartant).

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'Avoid effects that re-emit filtered actions.',
      recommended: 'error',
      requiresTypeChecking: true,
    },
    schema: [],
    messages: {
      [messageId]: '`Effects` that re-emit filtered actions are forbidden.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const actionsName = findNgRxEffectActionsName(context)
    if (!actionsName) return {}

    const { getType, typeChecker } = getTypeServices(context)

    function checkNode(pipeCallExpression: TSESTree.CallExpression) {
      const operatorCallExpression = pipeCallExpression.arguments.find(
        (arg) =>
          isCallExpression(arg) &&
          isIdentifier(arg.callee) &&
          arg.callee.name === 'ofType',
      )
      if (!operatorCallExpression) {
        return
      }
      const operatorType = getType(operatorCallExpression)
      const [signature] = typeChecker.getSignaturesOfType(
        operatorType,
        ts.SignatureKind.Call,
      )

      if (!signature) {
        return
      }
      const operatorReturnType = typeChecker.getReturnTypeOfSignature(signature)
      if (!isTypeReference(operatorReturnType)) {
        return
      }
      const [operatorElementType] =
        typeChecker.getTypeArguments(operatorReturnType)
      if (!operatorElementType) {
        return
      }

      const pipeType = getType(pipeCallExpression)
      if (!isTypeReference(pipeType)) {
        return
      }
      const [pipeElementType] = typeChecker.getTypeArguments(pipeType)
      if (!pipeElementType) {
        return
      }

      const operatorActionTypes = getPossibleTypes(operatorElementType, 'type')
      const pipeActionTypes = getPossibleTypes(pipeElementType, 'type')

      for (const actionType of operatorActionTypes) {
        if (pipeActionTypes.includes(actionType)) {
          context.report({
            node: pipeCallExpression.callee,
            messageId,
          })
          return
        }
      }
    }

    function getTypeOfSymbol(symbol: ts.Symbol): ts.Type | null {
      const { valueDeclaration } = symbol

      if (!valueDeclaration) {
        return null
      }

      if (valueDeclaration.kind === ts.SyntaxKind.PropertyDeclaration) {
        const { parent } = symbol as typeof symbol & { parent: ts.Symbol }
        return parent.valueDeclaration
          ? typeChecker.getTypeOfSymbolAtLocation(
              parent,
              parent.valueDeclaration,
            )
          : null
      }

      return typeChecker.getTypeOfSymbolAtLocation(symbol, valueDeclaration)
    }

    function getPossibleTypes(
      type: ts.Type,
      propertyName: string,
    ): readonly string[] {
      if (type.isUnion()) {
        return type.types.reduce<readonly string[]>(
          (accumulator, memberType) => {
            return accumulator.concat(
              getPossibleTypes(memberType, propertyName),
            )
          },
          [],
        )
      }

      const symbol = typeChecker.getPropertyOfType(type, propertyName)

      if (!symbol) {
        return []
      }

      const symbolType = getTypeOfSymbol(symbol)

      if (!symbolType) {
        return []
      }

      return [typeChecker.typeToString(symbolType)]
    }

    let hasDispatchFalse = false
    const pipeNodes = new Set<TSESTree.CallExpression>()

    return {
      [createEffectExpression]({
        arguments: [, effectConfig],
      }: TSESTree.CallExpression) {
        if (!effectConfig) {
          return (hasDispatchFalse = false)
        }

        const effectConfigType = getType(effectConfig)
        hasDispatchFalse = getPossibleTypes(effectConfigType, 'dispatch').some(
          (type) => type === 'false',
        )
      },
      [`${createEffectExpression} ${storePipe(actionsName)}`](
        node: TSESTree.CallExpression,
      ) {
        pipeNodes.add(node)
      },
      [`${createEffectExpression}:exit`]() {
        if (!hasDispatchFalse) {
          for (const pipeNode of pipeNodes) {
            checkNode(pipeNode)
          }
        }

        hasDispatchFalse = false
        pipeNodes.clear()
      },
    }
  },
})
