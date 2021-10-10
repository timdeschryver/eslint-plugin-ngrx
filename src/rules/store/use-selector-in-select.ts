import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  asPattern,
  docsUrl,
  getNgRxStores,
  isArrowFunctionExpression,
  isFunctionExpression,
  isLiteral,
  pipeableSelect,
  selectExpression,
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
    const { identifiers = [] } = getNgRxStores(context)
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null

    if (!storeNames) {
      return {}
    }

    return {
      [`${pipeableSelect(storeNames)}, ${selectExpression(storeNames)}`](
        node: TSESTree.CallExpression,
      ) {
        for (const argument of node.arguments) {
          if (
            !isLiteral(argument) &&
            !isArrowFunctionExpression(argument) &&
            !isFunctionExpression(argument)
          ) {
            break
          }

          context.report({
            node: argument,
            messageId,
          })
        }
      },
    }
  },
})
