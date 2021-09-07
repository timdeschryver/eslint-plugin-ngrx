import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  findNgRxStoreName,
  getImportAddFix,
  getImportDeclarations,
  getImportRemoveFix,
  getNearestUpperNodeFrom,
  isClassDeclaration,
  MODULE_PATHS,
  pipeableSelect,
  storeSelect,
} from '../../utils'

export const methodSelectMessageId = 'methodSelect'
export const operatorSelectMessageId = 'operatorSelect'

export type MessageIds =
  | typeof methodSelectMessageId
  | typeof operatorSelectMessageId

export const enum SelectStyle {
  Operator = 'operator',
  Method = 'method',
}

type Options = [`${SelectStyle}`]
type MemberExpressionWithProperty = Omit<
  TSESTree.MemberExpression,
  'property'
> & {
  property: TSESTree.Identifier
}
type CallExpression = Omit<TSESTree.CallExpression, 'parent'> & {
  callee: MemberExpressionWithProperty
  parent: TSESTree.CallExpression & {
    callee: Omit<TSESTree.MemberExpression, 'object'> & {
      object: MemberExpressionWithProperty
    }
  }
}

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      category: 'Best Practices',
      description:
        'Selectors can be used either with `select` as a pipeable operator or as a method.',
      recommended: 'warn',
    },
    fixable: 'code',
    schema: [
      {
        type: 'string',
        enum: [SelectStyle.Method, SelectStyle.Operator],
        additionalProperties: false,
      },
    ],
    messages: {
      [methodSelectMessageId]:
        'Selectors should be used with select method: `this.store.select(selector)`.',
      [operatorSelectMessageId]:
        'Selectors should be used with the pipeable operator: `this.store.pipe(select(selector))`.',
    },
  },
  defaultOptions: [SelectStyle.Method],
  create: (context, [mode]) => {
    const storeName = findNgRxStoreName(context)
    if (!storeName) return {}

    if (mode === SelectStyle.Method) {
      const sourceCode = context.getSourceCode()

      return {
        [pipeableSelect(storeName)](node: CallExpression) {
          context.report({
            node: node.callee,
            messageId: methodSelectMessageId,
            fix: (fixer) => {
              const importDeclarations =
                getImportDeclarations(node, MODULE_PATHS.store) ?? []
              const text = sourceCode.getText()
              const totalPipeSelectOccurrences =
                getTotalPipeSelectOccurrences(text)
              const importRemoveFix =
                totalPipeSelectOccurrences === 1
                  ? getImportRemoveFix(
                      sourceCode,
                      importDeclarations,
                      'select',
                      fixer,
                    )
                  : []

              return getOperatorToMethodFixes(node, sourceCode, fixer).concat(
                importRemoveFix,
              )
            },
          })
        },
      }
    }

    return {
      [storeSelect(storeName)](node: CallExpression) {
        context.report({
          node: node.callee.property,
          messageId: operatorSelectMessageId,
          fix: (fixer) => getMethodToOperatorFixes(node, fixer),
        })
      },
    }
  },
})

function getMethodToOperatorFixes(
  node: CallExpression,
  fixer: TSESLint.RuleFixer,
): TSESLint.RuleFix[] {
  const classDeclaration = getNearestUpperNodeFrom(node, isClassDeclaration)

  if (!classDeclaration) {
    return []
  }

  return [
    fixer.insertTextBefore(node.callee.property, 'pipe('),
    fixer.insertTextAfter(node, ')'),
  ].concat(
    getImportAddFix({
      fixer,
      importName: 'select',
      moduleName: MODULE_PATHS.store,
      node: classDeclaration,
    }),
  )
}

function getOperatorToMethodFixes(
  node: CallExpression,
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
): TSESLint.RuleFix[] {
  const { parent } = node
  const pipeContainsOnlySelect = parent.arguments.length === 1

  if (pipeContainsOnlySelect) {
    const pipeRange: TSESTree.Range = [
      parent.callee.property.range[0],
      parent.callee.property.range[1] + 1,
    ]
    const trailingParenthesisRange: TSESTree.Range = [
      parent.range[1] - 1,
      parent.range[1],
    ]

    return [
      fixer.removeRange(pipeRange),
      fixer.removeRange(trailingParenthesisRange),
    ]
  }

  const text = sourceCode.getText(node)
  const nextToken = sourceCode.getTokenAfter(node)
  const selectOperatorRange: TSESTree.Range = [
    node.range[0],
    nextToken?.range[1] ?? node.range[1],
  ]
  const storeRange = parent.callee.object.range

  return [
    fixer.removeRange(selectOperatorRange),
    fixer.insertTextAfterRange(storeRange, `.${text}`),
  ]
}

function getTotalPipeSelectOccurrences(text: string) {
  return text.replace(/\s/g, '').match(/pipe\(select\(/g)?.length ?? 0
}
