import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  actionReducerMap,
  docsUrl,
  isIdentifier,
  isLiteral,
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
