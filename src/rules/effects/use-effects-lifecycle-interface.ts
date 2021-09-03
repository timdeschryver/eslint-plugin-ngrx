import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  getImplementsSchemaFixer,
  getImportAddFix,
  getNearestUpperNodeFrom,
  isClassDeclaration,
  isIdentifier,
  MODULE_PATHS,
} from '../../utils'

export const messageId = 'useEffectsLifecycleInterface'
export type MessageIds = typeof messageId

type Options = []

const lifecycleMapper = {
  ngrxOnInitEffects: 'OnInitEffects',
  ngrxOnRunEffects: 'OnRunEffects',
  ngrxOnIdentifyEffects: 'OnIdentifyEffects',
} as const
const lifecyclesPattern = Object.keys(lifecycleMapper).join('|')

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods',
      recommended: 'warn',
    },
    fixable: 'code',
    schema: [],
    messages: {
      [messageId]:
        "Lifecycle interface '{{ interfaceName }}' should be implemented for method '{{ methodName }}'.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`ClassDeclaration > ClassBody > MethodDefinition > Identifier[name=/${lifecyclesPattern}/]`](
        node: TSESTree.Identifier,
      ) {
        const classDeclaration = getNearestUpperNodeFrom(
          node,
          isClassDeclaration,
        )

        if (!classDeclaration) return

        const interfaces = (classDeclaration.implements ?? [])
          .map(({ expression }) => expression)
          .filter(isIdentifier)
          .map(({ name }) => name)
        const methodName = node.name as keyof typeof lifecycleMapper
        const interfaceName = lifecycleMapper[methodName]

        if (interfaces.includes(interfaceName)) return

        const { implementsNodeReplace, implementsTextReplace } =
          getImplementsSchemaFixer(classDeclaration, interfaceName)
        context.report({
          fix: (fixer) => {
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
          data: { interfaceName, methodName },
        })
      },
    }
  },
})
