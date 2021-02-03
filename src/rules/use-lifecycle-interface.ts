import { ESLintUtils, TSESTree } from '@typescript-eslint/experimental-utils'

import { docsUrl, findClassDeclarationNode, isIdentifier } from '../utils'

export const ruleName = 'use-lifecycle-interface'

export const messageId = 'useLifecycleInterface'
export type MessageIds = typeof messageId

type Options = []

const lifecycles = [
  'ngrxOnInitEffects',
  'ngrxOnRunEffects',
  'ngrxOnIdentifyEffects',
]

const lifecyclesRegexp = lifecycles.join('|')

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: ruleName,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'Ensures classes implement lifecycle interfaces corresponding to the declared lifecycle methods',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        "Lifecycle interface '{{ interfaceName }}' should be implemented for method '{{ methodName }}'.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      [`ClassDeclaration > ClassBody > MethodDefinition > Identifier[name=/${lifecyclesRegexp}/]`](
        node: TSESTree.Identifier,
      ) {
        const clazz = findClassDeclarationNode(node)

        if (!clazz) return

        const implementz = (clazz.implements || []).map((i) =>
          isIdentifier(i.expression) ? i.expression.name : '',
        )
        const methodName = node.name
        const interfaceName = methodName.substr(4)

        if (!implementz.includes(interfaceName)) {
          context.report({
            node,
            messageId,
            data: {
              methodName,
              interfaceName,
            },
          })
        }
      },
    }
  },
})
