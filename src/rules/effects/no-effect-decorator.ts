import path from 'path'
import { ESLintUtils, TSESLint } from '@typescript-eslint/experimental-utils'
import type { TSESTree } from '@typescript-eslint/experimental-utils'
import {
  classPropertyWithEffectDecorator,
  docsUrl,
  findClassDeclarationNode,
  getConditionalImportFix,
  getDecoratorArgument,
  isIdentifier,
  MODULE_PATHS,
} from '../../utils'

export const noEffectDecorator = 'noEffectDecorator'
export const noEffectDecoratorSuggest = 'noEffectDecoratorSuggest'
export type MessageIds =
  | typeof noEffectDecorator
  | typeof noEffectDecoratorSuggest

type Options = []
type EffectDecorator = TSESTree.Decorator & {
  parent: TSESTree.ClassProperty & { value: TSESTree.CallExpression }
}

const createEffect = 'createEffect'

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'The createEffect creator function is preferred',
      recommended: 'warn',
      suggestion: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      [noEffectDecorator]: 'The createEffect creator function is preferred.',
      [noEffectDecoratorSuggest]: 'Remove the `@Effect` decorator.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()

    return {
      [classPropertyWithEffectDecorator](node: EffectDecorator) {
        const isUsingEffectCreator =
          isIdentifier(node.parent.value.callee) &&
          node.parent.value.callee.name === createEffect

        context.report({
          ...(isUsingEffectCreator
            ? {
                suggest: [
                  {
                    fix: (fixer) => fixer.remove(node),
                    messageId: noEffectDecoratorSuggest,
                  },
                ],
              }
            : { fix: (fixer) => getFixes(node, sourceCode, fixer) }),
          node,
          messageId: noEffectDecorator,
        })
      },
    }
  },
})

function getCreateEffectFix(
  fixer: TSESLint.RuleFixer,
  propertyValueExpression: TSESTree.CallExpression,
): TSESLint.RuleFix {
  return fixer.insertTextBefore(
    propertyValueExpression,
    `${createEffect}(() => { return `,
  )
}

function getCreateEffectConfigFix(
  fixer: TSESLint.RuleFixer,
  propertyValueExpression: TSESTree.CallExpression,
  configText?: string,
): TSESLint.RuleFix {
  const append = configText ? `, ${configText}` : ''
  return fixer.insertTextAfter(propertyValueExpression, `}${append})`)
}

function getFixes(
  node: EffectDecorator,
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
): TSESLint.RuleFix[] {
  const classDeclaration = findClassDeclarationNode(node)

  if (!classDeclaration) return []

  const {
    parent: { value: propertyValueExpression },
  } = node

  const decoratorArgument = getDecoratorArgument(node)
  const configText = decoratorArgument
    ? sourceCode.getText(decoratorArgument)
    : undefined

  return getConditionalImportFix(
    fixer,
    classDeclaration,
    createEffect,
    MODULE_PATHS.effects,
  ).concat(
    fixer.remove(node),
    getCreateEffectFix(fixer, propertyValueExpression),
    getCreateEffectConfigFix(fixer, propertyValueExpression, configText),
  )
}
