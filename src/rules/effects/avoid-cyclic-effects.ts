import ts from 'typescript'
import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import {
  createEffectExpression,
  docsUrl,
  findNgRxEffectActionsName,
  isCallExpression,
  isIdentifier,
  isTypeReference,
} from '../../utils'
import { getTypeServices } from 'eslint-etc'

export const messageId = 'avoidCyclicEffects'
export type MessageIds = typeof messageId

type Options = []

// This rule is a modified version (to support dispatch: false) from the eslint-plugin-rxjs plugin.
// The original implementation can be found at https://github.com/cartant/eslint-plugin-rxjs/blob/main/source/rules/no-cyclic-action.ts
// Thank you Nicholas Jamieson (@cartant).

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Possible Errors',
      description: 'Avoid effects that re-emit filtered actions.',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]: 'Effects that re-emit filtered actions are forbidden.',
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

      const operatorActionTypes = getActionTypes(operatorElementType)
      const pipeActionTypes = getActionTypes(pipeElementType)

      for (const actionType of operatorActionTypes) {
        if (pipeActionTypes.includes(actionType)) {
          context.report({
            messageId,
            node: pipeCallExpression.callee,
          })
          return
        }
      }
    }

    function getActionTypes(type: ts.Type): string[] {
      if (type.isUnion()) {
        const memberActionTypes: string[] = []
        for (const memberType of type.types) {
          memberActionTypes.push(...getActionTypes(memberType))
        }
        return memberActionTypes
      }
      const symbol = typeChecker.getPropertyOfType(type, 'type')
      if (!symbol?.valueDeclaration) {
        return []
      }
      const actionType = typeChecker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration,
      )

      // TODO: support "dynamic" types
      // e.g. const genericFoo = createAction(`${subject} FOO`); (resolves to 'string')
      if (typeChecker.typeToString(actionType) === 'string') {
        return []
      }
      return [typeChecker.typeToString(actionType)]
    }

    return {
      [`${createEffectExpression}:not([arguments.1]:has(Property[key.name="dispatch"][value.value=false])) CallExpression[callee.property.name='pipe'][callee.object.property.name="${actionsName}"]`]:
        checkNode,
    }
  },
})
