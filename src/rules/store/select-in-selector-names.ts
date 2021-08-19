import path from 'path'
import {
  AST_NODE_TYPES,
  ESLintUtils,
  TSESTree,
} from '@typescript-eslint/experimental-utils'
import { isIdentifier, isLiteral } from '../../utils/helper-functions/index'

import { memorizedSelector, selectorsNames, docsUrl } from '../../utils'

export const messageId = 'selectInSelectorNames'
export type MessageIds = typeof messageId

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description: 'Name Selector Functions as selectThing',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]: 'Name Selector Functions as selectThing',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const includedKeyword = 'select'

    function hasKeyword(name: string): boolean {
      // console.log(name.toLowerCase().startsWith(includedKeyword))
      return name.toLowerCase().startsWith(includedKeyword)
    }

    return {
      [`VariableDeclaration[declarations.length>0]`](
        node: TSESTree.VariableDeclaration,
      ) {
        for (const dec of node.declarations) {
          const id: TSESTree.Identifier = (dec.id as any) as TSESTree.Identifier
          // console.log(id.name) //, dec.id.typeAnnotation?.typeAnnotation)
          if (dec.id.typeAnnotation?.typeAnnotation) {
            if (
              /^${memorizedSelectorTypes}$/.exec(
                ((dec.id.typeAnnotation
                  ?.typeAnnotation as TSESTree.TSTypeReference)
                  .typeName as TSESTree.Identifier).name as string,
              ) === null
            ) {
              if (!hasKeyword(id.name)) {
                context.report({ node: id, messageId })
              }
            }
          } else {
            // console.log(dec.init)
            if (dec.init?.type === AST_NODE_TYPES.CallExpression) {
              if (
                /^${selectorsNames}$/.exec(
                  (dec.init.callee as TSESTree.Identifier).name,
                ) === null
              ) {
                if (!hasKeyword(id.name)) {
                  context.report({ node: id, messageId })
                }
              }
            }
          }
        }
      },
    }
  },
})
