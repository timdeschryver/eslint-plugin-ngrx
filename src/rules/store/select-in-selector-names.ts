import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'
import { isIdentifier, isLiteral } from '../../utils/helper-functions/index'

import { memorizedSelector, docsUrl } from '../../utils'

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
      [messageId]:
        'Name Selector Functions as selectThing',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const includedKeyword = 'select'

    function hasKeyword(name: string): boolean {
      return name.toLowerCase().startsWith(includedKeyword)
    }

    return {
      [`${memorizedSelector}`](
        node: TSESTree.Property,
      ) {
        const key = node.key
        if (
          (isLiteral(key) && !hasKeyword(key.raw)) ||
          (isIdentifier(key) && !hasKeyword(key.name))
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
