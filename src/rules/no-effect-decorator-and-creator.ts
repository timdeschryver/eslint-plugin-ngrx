import path from 'path'
import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { effectCreator, effectDecorator, docsUrl } from '../utils'

export const messageId = 'noEffectDecoratorAndCreator'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description:
        'An Effect should only use the effect creator (`createEffect`) or the effect decorator (`@Effect`), but not both simultaneously',
      recommended: 'error',
    },
    schema: [],
    messages: {
      [messageId]:
        'Remove the `@Effect` decorator or the `createEffect` creator function',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const effects: TSESTree.ClassProperty[] = []

    function isDuplicate(effect: TSESTree.ClassProperty) {
      if (effects.includes(effect)) {
        context.report({
          node: effect.key,
          messageId,
        })
      } else {
        effects.push(effect)
      }
    }

    return {
      [effectCreator](node: TSESTree.ClassProperty) {
        isDuplicate(node)
      },
      [effectDecorator](node: TSESTree.Decorator) {
        isDuplicate(node.parent as TSESTree.ClassProperty)
      },
    }
  },
})
