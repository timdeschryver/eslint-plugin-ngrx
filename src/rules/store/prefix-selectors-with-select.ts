import type { TSESTree } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import path from 'path'
import { capitalize, docsUrl } from '../../utils'

export const prefixSelectorsWithSelect = 'prefixSelectorsWithSelect'
export const prefixSelectorsWithSelectSuggest =
  'prefixSelectorsWithSelectSuggest'
export type MessageIds =
  | typeof prefixSelectorsWithSelect
  | typeof prefixSelectorsWithSelectSuggest

type Options = []

export default ESLintUtils.RuleCreator(docsUrl)<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Best Practices',
      description:
        'The selector should start with "select", for example "selectThing".',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [prefixSelectorsWithSelect]: 'The selector should start with "select".',
      [prefixSelectorsWithSelectSuggest]:
        'Prefix the selector with "select": `{{name}}`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      'VariableDeclarator[id.name!=/^select[A-Z][a-zA-Z]+$/]:matches([id.typeAnnotation.typeAnnotation.typeName.name=/^MemoizedSelector(WithProps)?$/], :has(CallExpression[callee.name=/^(create(Feature)?Selector|createSelectorFactory)$/]))'({
        id,
      }: TSESTree.VariableDeclarator & { id: TSESTree.Identifier }) {
        const suggestedName = getSuggestedName(id.name)
        context.report({
          loc: {
            ...id.loc,
            end: {
              ...id.loc.end,
              column: id.typeAnnotation?.range[0] ?? id.range[1],
            },
          },
          node: id,
          messageId: prefixSelectorsWithSelect,
          suggest: [
            {
              messageId: prefixSelectorsWithSelectSuggest,
              fix: (fixer) =>
                fixer.replaceTextRange(
                  [id.range[0], id.typeAnnotation?.range[0] ?? id.range[1]],
                  suggestedName,
                ),
              data: {
                name: suggestedName,
              },
            },
          ],
        })
      },
    }
  },
})

function getSuggestedName(name: string) {
  const selectWord = 'select'
  // Ex: 'selectfeature' => 'selectFeature'
  let possibleReplacedName = name.replace(
    RegExp(`^${selectWord}(.+)`),
    (_, lowercasedWord: string) => {
      return `${selectWord}${capitalize(lowercasedWord)}`
    },
  )

  if (name !== possibleReplacedName) {
    return possibleReplacedName
  }

  // Ex: 'getCount' => 'selectCount'
  possibleReplacedName = name.replace(
    /^get([A-Z][A-Za-z\d]+)/,
    (_, capitalizedWord: string) => {
      return `${selectWord}${capitalizedWord}`
    },
  )

  if (name !== possibleReplacedName) {
    return possibleReplacedName
  }

  // Ex: 'item' => 'selectItem'
  return `${selectWord}${capitalize(name)}`
}
