import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { createRule } from '../../rule-creator'
import {
  classPropertyWithEffectDecorator,
  getDecoratorArguments,
  getImportAddFix,
  isIdentifier,
  NGRX_MODULE_PATHS,
} from '../../utils'

export const noEffectDecorator = 'noEffectDecorator'
export const noEffectDecoratorSuggest = 'noEffectDecoratorSuggest'

type MessageIds = typeof noEffectDecorator | typeof noEffectDecoratorSuggest
type Options = readonly []
type EffectDecorator = TSESTree.Decorator & {
  parent: TSESTree.ClassProperty & {
    parent: TSESTree.ClassBody & { parent: TSESTree.ClassDeclaration }
    value: TSESTree.CallExpression
  }
}

const createEffectKeyword = 'createEffect'

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'effects',
    docs: {
      category: 'Best Practices',
      description: `The \`${createEffectKeyword}\` is preferred as the \`@Effect\` decorator is deprecated.`,
      recommended: 'warn',
      suggestion: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      [noEffectDecorator]: `The \`@Effect\` decorator is deprecated. Use \`${createEffectKeyword}\` instead.`,
      [noEffectDecoratorSuggest]: `Remove the \`@Effect\` decorator.`,
    },
  },
  defaultOptions: [],
  create: (context) => {
    const sourceCode = context.getSourceCode()

    return {
      [classPropertyWithEffectDecorator](node: EffectDecorator) {
        const isUsingEffectCreator =
          isIdentifier(node.parent.value.callee) &&
          node.parent.value.callee.name === createEffectKeyword

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
    `${createEffectKeyword}(() => { return `,
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
): readonly TSESLint.RuleFix[] {
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
      importName: createEffectKeyword,
      moduleName: NGRX_MODULE_PATHS.effects,
      node: classDeclaration,
    }),
  )
}
