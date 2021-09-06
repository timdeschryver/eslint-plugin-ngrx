import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  getImplementsSchemaFixer,
  getImportAddFix,
  getInterface,
  MODULE_PATHS,
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
    const lifecycleMapper = {
      ngrxOnIdentifyEffects: 'OnIdentifyEffects',
      ngrxOnInitEffects: 'OnInitEffects',
      ngrxOnRunEffects: 'OnRunEffects',
    } as const
    const lifecyclesPattern = Object.keys(lifecycleMapper).join('|')

    return {
      [`ClassDeclaration > ClassBody > MethodDefinition > Identifier[name=/${lifecyclesPattern}/]`](
        node: TSESTree.Identifier & {
          name: keyof typeof lifecycleMapper
          parent: TSESTree.MethodDefinition & {
            parent: TSESTree.ClassBody & { parent: TSESTree.ClassDeclaration }
          }
        },
      ) {
        const classDeclaration = node.parent.parent.parent
        const methodName = node.name
        const interfaceName = lifecycleMapper[methodName]

        if (getInterface(classDeclaration, interfaceName)) {
          return
        }

        context.report({
          fix: (fixer) => {
            const { implementsNodeReplace, implementsTextReplace } =
              getImplementsSchemaFixer(classDeclaration, interfaceName)
            return [
              fixer.insertTextAfter(
                implementsNodeReplace,
                implementsTextReplace,
              ),
            ].concat(
              getImportAddFix({
                compatibleWithTypeOnlyImport: true,
                fixer,
                importedName: interfaceName,
                moduleName: MODULE_PATHS.effects,
                node: classDeclaration,
              }),
            )
          },
          node,
          messageId,
          data: {
            interfaceName,
            methodName,
          },
        })
      },
    }
  },
})
