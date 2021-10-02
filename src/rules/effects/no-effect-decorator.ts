import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  classPropertyWithEffectDecorator,
  docsUrl,
  getDecoratorArguments,
  getImportAddFix,
  isIdentifier,
  NGRX_MODULE_PATHS,
} from '../../utils'

export const noEffectDecorator = 'noEffectDecorator'
export const noEffectDecoratorSuggest = 'noEffectDecoratorSuggest'
export type MessageIds =
  | typeof noEffectDecorator
  | typeof noEffectDecoratorSuggest

type Options = []
type EffectDecorator = TSESTree.Decorator & {
  parent: TSESTree.ClassProperty & {
    parent: TSESTree.ClassBody & { parent: TSESTree.ClassDeclaration }
    value: TSESTree.CallExpression
  }
}

const createEffect = 'createEffect'

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description: 'The `createEffect` creator function is preferred.',
      recommended: 'warn',
      suggestion: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      [noEffectDecorator]: 'The `createEffect` creator function is preferred.',
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
          node,
          messageId: noEffectDecorator,
          ...(isUsingEffectCreator
            ? {
                suggest: [
                  {
                    messageId: noEffectDecoratorSuggest,
                    fix: (fixer) => fixer.remove(node),
                  },
                ],
              }
            : { fix: (fixer) => getFixes(node, sourceCode, fixer) }),
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
  const classDeclaration = node.parent.parent.parent
  const {
    parent: { value: propertyValueExpression },
  } = node

  const [decoratorArgument] = getDecoratorArguments(node)
  const configText = decoratorArgument
    ? sourceCode.getText(decoratorArgument)
    : undefined

  return [
    fixer.remove(node),
    getCreateEffectFix(fixer, propertyValueExpression),
    getCreateEffectConfigFix(fixer, propertyValueExpression, configText),
  ].concat(
    getImportAddFix({
      fixer,
      importName: createEffect,
      moduleName: NGRX_MODULE_PATHS.effects,
      node: classDeclaration,
    }),
  )
}
