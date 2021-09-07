import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { docsUrl } from '../../utils'

export const messageId = 'prefixSelectorsWithSelect'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'The selector should start with "select", for example "selectThing".',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]: 'The selector should start with "select".',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      'VariableDeclarator[id.name!=/^select[A-Z][a-zA-Z]+$/]:matches([id.typeAnnotation.typeAnnotation.typeName.name=/^MemoizedSelector(WithProps)?$/], :has(CallExpression[callee.name=/^(create(Feature)?Selector|createSelectorFactory)$/]))'({
        id,
      }: TSESTree.VariableDeclarator) {
        context.report({
          loc: {
            ...id.loc,
            end: {
              ...id.loc.end,
              column: id.typeAnnotation?.range[0] ?? id.range[1],
            },
          },
          node: id,
          messageId,
        })
      },
    }
  },
})
