import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  effectCreator,
  effectDecorator,
  getDecorator,
  getDecoratorArguments,
} from '../../utils'

export const noEffectDecoratorAndCreator = 'noEffectDecoratorAndCreator'
export const noEffectDecoratorAndCreatorSuggest =
  'noEffectDecoratorAndCreatorSuggest'
export type MessageIds =
  | typeof noEffectDecoratorAndCreator
  | typeof noEffectDecoratorAndCreatorSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description:
        'An `Effect` should only use the effect creator (`createEffect`) or the effect decorator (`@Effect`), but not both simultaneously.',
      recommended: 'error',
      suggestion: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      [noEffectDecoratorAndCreator]:
        'Remove the `@Effect` decorator or the `createEffect` creator function.',
      [noEffectDecoratorAndCreatorSuggest]: 'Remove the `@Effect` decorator.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`${effectCreator}:has(${effectDecorator})`](
        node: TSESTree.ClassProperty,
      ) {
        const decorator = getDecorator(node, 'Effect')

        if (!decorator) {
          return
        }

        const hasDecoratorArgument = Boolean(
          getDecoratorArguments(decorator)[0],
        )

        context.report({
          ...(hasDecoratorArgument
            ? {
                // In this case where the argument to the `@Effect({...})`
                // decorator exists, it is more appropriate to **suggest**
                // instead of **fix**, since either simply removing or merging
                // the arguments would likely generate unexpected behaviors and
                // would be quite costly.
                suggest: [
                  {
                    fix: (fixer) => fixer.remove(decorator),
                    messageId: noEffectDecoratorAndCreatorSuggest,
                  },
                ],
              }
            : {
                fix: (fixer) => fixer.remove(decorator),
              }),
          node: node.key,
          messageId: noEffectDecoratorAndCreator,
        })
      },
    }
  },
})
