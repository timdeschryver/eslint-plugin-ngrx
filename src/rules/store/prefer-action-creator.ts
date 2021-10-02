import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { docsUrl } from '../../utils'

export const messageId = 'preferActionCreator'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Using an `action creator` is preferred over `Action class`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using `Action class` is not preferred, use an `action creator` instead.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`ClassDeclaration:has(TSClassImplements:matches([expression.name='Action'], [expression.property.name='Action'])):has(ClassProperty[key.name='type'])`](
        node: TSESTree.ClassDeclaration,
      ) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
