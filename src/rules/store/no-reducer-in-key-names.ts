import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  actionReducerMap,
  docsUrl,
  metadataProperty,
  storeActionReducerMap,
} from '../../utils'

export const messageId = 'noReducerInKeyNames'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Avoid the word "reducer" in the `Reducer` key names.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Avoid the word "reducer" in the key names to better represent the state.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`:matches(${storeActionReducerMap}, ${actionReducerMap}) > :matches(Property[key.type='Identifier'][key.name=/reducer$/i], ${metadataProperty(
        /reducer$/i,
      )})`]({ key }: TSESTree.Property) {
        context.report({
          node: key,
          messageId,
        })
      },
    }
  },
})
