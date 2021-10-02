import type { TSESLint, TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import {
  docsUrl,
  findNgRxStoreName,
  getImportAddFix,
  getImportRemoveFix,
  getNearestUpperNodeFrom,
  isCallExpression,
  isClassDeclaration,
  isMemberExpression,
  NGRX_MODULE_PATHS,
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

    if (mode === SelectStyle.Operator) {
      return {
        [storeSelect(storeName)](node: CallExpression) {
          context.report({
            node: node.callee.property,
            messageId: operatorSelectMessageId,
            fix: (fixer) => getMethodToOperatorFixes(node, fixer),
          })
        },
      }
    }

    const sourceCode = context.getSourceCode()

    return {
      [`Program:has(${pipeableSelect(
        storeName,
      )}) ImportDeclaration[source.value='${
        NGRX_MODULE_PATHS.store
      }'] > ImportSpecifier[imported.name='select']`](
        node: TSESTree.ImportSpecifier & {
          parent: TSESTree.ImportDeclaration
        },
      ) {
        context.report({
          node,
          messageId: methodSelectMessageId,
          fix: (fixer) =>
            getImportRemoveFix(sourceCode, [node.parent], 'select', fixer),
        })

        const [{ references }] = context.getDeclaredVariables(node)

        for (const { identifier } of references) {
          context.report({
            node: identifier,
            messageId: methodSelectMessageId,
            fix: (fixer) =>
              getOperatorToMethodFixes(identifier, sourceCode, fixer),
          })
        }
      },
    }
  },
})

function getMethodToOperatorFixes(
  node: CallExpression,
  fixer: TSESLint.RuleFixer,
): readonly TSESLint.RuleFix[] {
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
      moduleName: NGRX_MODULE_PATHS.store,
      node: classDeclaration,
    }),
  )
}

function getOperatorToMethodFixes(
  identifier: TSESTree.Node,
  sourceCode: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
): readonly TSESLint.RuleFix[] {
  const select = identifier.parent
  const storePipe = select?.parent

  if (
    !storePipe ||
    !isCallExpression(storePipe) ||
    !isMemberExpression(storePipe.callee)
  ) {
    return []
  }

  const pipeContainsOnlySelect = storePipe.arguments.length === 1

  if (!pipeContainsOnlySelect) {
    const selectContent = sourceCode.getText(select)
    const nextTokenAfterSelect = sourceCode.getTokenAfter(select)
    const store = storePipe.callee.object
    return [
      fixer.remove(select),
      ...(nextTokenAfterSelect ? [fixer.remove(nextTokenAfterSelect)] : []),
      fixer.insertTextAfter(store, `.${selectContent}`),
    ]
  }

  const { property } = storePipe.callee
  const nextTokenAfterPipe = sourceCode.getTokenAfter(property)
  const [pipeInitialRange, pipeEndRange] = property.range
  const pipeRange: TSESTree.Range = [
    pipeInitialRange,
    nextTokenAfterPipe?.range[1] ?? pipeEndRange,
  ]
  const [, selectEndRange] = identifier.range
  return [
    fixer.removeRange(pipeRange),
    fixer.insertTextAfterRange([selectEndRange, selectEndRange + 1], '('),
  ]
}
