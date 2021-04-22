import path from 'path'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import type { TSESTree } from '@typescript-eslint/experimental-utils'

import {
  docsUrl,
  findClassDeclarationNode,
  findImportDeclarationNode,
  getConditionalImportFix,
  getImplementsSchemaFixer,
  isIdentifier,
} from '../utils'

export const messageId = 'useLifecycleInterface'
export type MessageIds = typeof messageId

type Options = []

const lifecycleMapper = {
  ngrxOnInitEffects: 'OnInitEffects',
  ngrxOnRunEffects: 'OnRunEffects',
  ngrxOnIdentifyEffects: 'OnIdentifyEffects',
} as const
const effectsModulePath = '@ngrx/effects'
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
        const classDeclaration = findClassDeclarationNode(node)

        if (!classDeclaration) return

        const interfaces = (classDeclaration.implements ?? [])
          .map(({ expression }) => expression)
          .filter(isIdentifier)
          .map(({ name }) => name)
        const methodName = node.name as keyof typeof lifecycleMapper
        const interfaceName = lifecycleMapper[methodName]

        if (interfaces.includes(interfaceName)) return

        const {
          implementsNodeReplace,
          implementsTextReplace,
        } = getImplementsSchemaFixer(classDeclaration, interfaceName)
        context.report({
          fix: (fixer) => {
            const importDeclaration = findImportDeclarationNode(
              classDeclaration,
              effectsModulePath,
            )

            return getConditionalImportFix(
              fixer,
              importDeclaration,
              interfaceName,
              effectsModulePath,
            ).concat(
              fixer.insertTextAfter(
                implementsNodeReplace,
                implementsTextReplace,
              ),
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
