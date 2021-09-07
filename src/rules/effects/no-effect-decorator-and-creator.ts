import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  effectCreator,
  effectDecorator,
  getDecorator,
  getDecoratorArguments,
  getImportDeclarations,
  getImportRemoveFix,
  MODULE_PATHS,
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
    const sourceCode = context.getSourceCode()

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
                    fix: (fixer) =>
                      getFixes(node, sourceCode, fixer, decorator),
                    messageId: noEffectDecoratorAndCreatorSuggest,
                  },
                ],
              }
            : {
                fix: (fixer) => getFixes(node, sourceCode, fixer, decorator),
              }),
          node: node.key,
          messageId: noEffectDecoratorAndCreator,
        })
      },
    }
  },
})

function getFixes(
  node: TSESTree.ClassProperty,
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
  decorator: TSESTree.Decorator,
): TSESLint.RuleFix[] {
  const importDeclarations =
    getImportDeclarations(node, MODULE_PATHS.effects) ?? []
  const text = sourceCode.getText()
  const totalEffectDecoratorOccurrences = getEffectDecoratorOccurrences(text)
  const importRemoveFix =
    totalEffectDecoratorOccurrences === 1
      ? getImportRemoveFix(sourceCode, importDeclarations, 'Effect', fixer)
      : []

  return [fixer.remove(decorator)].concat(importRemoveFix)
}

function getEffectDecoratorOccurrences(text: string) {
  return text.replace(/\s/g, '').match(/@Effect/g)?.length ?? 0
}
