import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  findNgRxComponentStoreName,
  storeExpression,
} from '../../utils'

export const messageId = 'updaterExplicitReturnType'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: '`Updater` should have an explicit return type.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        '`Updater` should have an explicit return type when using arrow functions: `this.store.updater((state, value): State => {}`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxComponentStoreName(context)
    const withoutTypeAnnotation = `ArrowFunctionExpression:not([returnType.typeAnnotation])`
    const selectors = [
      `ClassDeclaration[superClass.name='ComponentStore'] CallExpression[callee.object.type='ThisExpression'][callee.property.name='updater'] > ${withoutTypeAnnotation}`,
      storeName &&
        `${storeExpression(
          storeName,
        )}[callee.property.name='updater'] > ${withoutTypeAnnotation}`,
    ]
      .filter(Boolean)
      .join(',')

    return {
      [selectors](node: TSESTree.ArrowFunctionExpression) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
