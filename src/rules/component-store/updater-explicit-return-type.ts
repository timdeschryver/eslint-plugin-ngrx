import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  asPattern,
  docsUrl,
  getNgRxComponentStores,
  namedExpression,
} from '../../utils'

export const messageId = 'updaterExplicitReturnType'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Possible Errors',
      description: '`Updater` should have an explicit return type.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        '`Updater` should have an explicit return type when using arrow functions: `this.store.updater((state, value): State => {}`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers } = getNgRxComponentStores(context)
    const storeNames = identifiers?.length ? asPattern(identifiers) : null
    const withoutTypeAnnotation = `ArrowFunctionExpression:not([returnType.typeAnnotation])`
    const selectors = [
      `ClassDeclaration[superClass.name='ComponentStore'] CallExpression[callee.object.type='ThisExpression'][callee.property.name='updater'] > ${withoutTypeAnnotation}`,
      storeNames &&
        `${namedExpression(
          storeNames,
        )}[callee.property.name='updater'] > ${withoutTypeAnnotation}`,
    ]
      .filter(Boolean)
      .join(',')

    return {
      [selectors](node: TSESTree.ArrowFunctionExpression) {
        context.report({
          node,
          messageId,
        })
      },
    }
  },
})
