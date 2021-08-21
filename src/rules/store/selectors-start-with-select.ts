import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { docsUrl } from '../../utils'

export const messageId = 'selectorsStartWithSelect'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'The variable name of a selector should start with "select", for example "selectThing"',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]: 'The variable name of a selector should start with "select"',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'VariableDeclarator[id.name!=/^select[A-Z][a-zA-Z]+$/]:matches(:has(TSTypeAnnotation[typeAnnotation.typeName.name=/^MemoizedSelector(WithProps$|$)/]), :has(CallExpression[callee.name=/^(createSelector|createFeatureSelector)$/]))'({
        id,
      }: TSESTree.VariableDeclarator) {
        context.report({ node: id, messageId })
      },
    }
  },
})
