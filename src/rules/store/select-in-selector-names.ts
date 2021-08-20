import path from 'path'
import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from '@typescript-eslint/experimental-utils'
import { isIdentifier, isLiteral } from '../../utils/helper-functions/index'

import { memorizedSelector, selectorsNames, docsUrl } from '../../utils'

export const messageId = 'selectInSelectorNames'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Name Selector Functions as selectThing',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]: 'Name Selector Functions as selectThing',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'VariableDeclarator[id.name=/^(?!select).+/]:matches(:has(TSTypeAnnotation[typeAnnotation.typeName.name=/^MemoizedSelector(Props$|$)/]), :has(CallExpression[callee.name=/^(createSelector|createFeatureSelector)$/]))'({
        id,
      }: TSESTree.VariableDeclarator) {
        context.report({ node: id, messageId })
      },
    }
  },
})
