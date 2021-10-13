import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  classImplements,
  docsUrl,
  getImplementsSchemaFixer,
  getImportAddFix,
  NGRX_MODULE_PATHS,
} from '../../utils'

export const messageId = 'useEffectsLifecycleInterface'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods.',
      recommended: 'warn',
    },
    fixable: 'code',
    schema: [],
    messages: {
      [messageId]:
        'Lifecycle interface `{{ interfaceName }}` should be implemented for method `{{ methodName }}`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const interfaceMethodNames = [
      ['OnIdentifyEffects', 'ngrxOnIdentifyEffects'],
      ['OnInitEffects', 'ngrxOnInitEffects'],
      ['OnRunEffects', 'ngrxOnRunEffects'],
    ] as const
    return interfaceMethodNames.reduce(
      (accumulator, [interfaceName, methodName]) => ({
        ...accumulator,
        [getSelector(interfaceName, methodName)](
          node: TSESTree.ClassDeclaration,
        ) {
          context.report({
            node: node.id ?? node,
            messageId,
            data: {
              interfaceName,
              methodName,
            },
            fix: (fixer) => getFixes(fixer, node, interfaceName),
          })
        },
      }),
      {},
    )
  },
})

function getSelector(interfaceName: string, methodName: string) {
  return `ClassDeclaration:not(:has(${classImplements(
    interfaceName,
  )})):has(ClassBody > MethodDefinition[key.name='${methodName}'])` as const
}

function getFixes(
  fixer: TSESLint.RuleFixer,
  node: TSESTree.ClassDeclaration,
  interfaceName: string,
): readonly TSESLint.RuleFix[] {
  const { implementsNodeReplace, implementsTextReplace } =
    getImplementsSchemaFixer(node, interfaceName)
  return [
    fixer.insertTextAfter(implementsNodeReplace, implementsTextReplace),
  ].concat(
    getImportAddFix({
      compatibleWithTypeOnlyImport: true,
      fixer,
      importName: interfaceName,
      moduleName: NGRX_MODULE_PATHS.effects,
      node,
    }),
  )
}
