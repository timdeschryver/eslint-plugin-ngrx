import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'
import { isIdentifier, isLiteral } from '../utils/helper-functions/index'

import { actionReducerMap, docsUrl, storeActionReducerMap } from '../utils'

export const ruleName = 'no-reducer-in-key-names'

export const messageId = 'noReducerInKeyNames'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: 'Avoid the word "reducer" in the key names',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'Avoid the word "reducer" in the key names to better represent the state.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const excludedKeyword = 'reducer'

    function hasKeyword(name: string): boolean {
      return name.toLowerCase().includes(excludedKeyword)
    }

    return {
      [`${storeActionReducerMap}, ${actionReducerMap}`](
        node: TSESTree.Property,
      ) {
        const key = node.key
        if (
          (isLiteral(key) && hasKeyword(key.raw)) ||
          (isIdentifier(key) && hasKeyword(key.name))
        ) {
          context.report({
            node: key,
            messageId,
          })
        }
      },
    }
  },
})
