import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  findNgRxStoreName,
  isArrowFunctionExpression,
  isFunctionExpression,
  isLiteral,
  pipeableSelect,
  storeSelect,
} from '../../utils'

export const messageId = 'useSelectorInSelect'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Using a selector in a `select` method is preferred over `string` or `props drilling`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using `string` or `props drilling` is not preferred, use a selector instead.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    return {
      [`${pipeableSelect(storeName)}, ${storeSelect(storeName)}`](
        node: TSESTree.CallExpression,
      ) {
        for (const arg of node.arguments) {
          if (
            !isLiteral(arg) &&
            !isArrowFunctionExpression(arg) &&
            !isFunctionExpression(arg)
          ) {
            break
          }

          context.report({
            node: arg,
            messageId,
          })
        }
      },
    }
  },
})
