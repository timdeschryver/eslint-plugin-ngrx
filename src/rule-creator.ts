import type { TSESLint } from '@typescript-eslint/experimental-utils'
import { ESLintUtils } from '@typescript-eslint/experimental-utils'
import type { NGRX_MODULE } from './utils'
import { docsUrl, MODULE_PATHS, ngrxVersionSatisfies } from './utils'

export type NgRxRuleModule<TMessageIds extends string = string> =
  TSESLint.RuleModule<TMessageIds, unknown[]> & {
    meta: { module: NGRX_MODULE; version?: string }
  }

type CreateRuleMetaDocs = Omit<TSESLint.RuleMetaDataDocs, 'url'>
type CreateRuleMeta<TMessageIds extends string> = {
  docs: CreateRuleMetaDocs
} & Omit<NgRxRuleModule<TMessageIds>['meta'], 'docs'>

export function createRule<
  TOptions extends readonly unknown[],
  TMessageIds extends string,
>(
  config: Readonly<{
    name: string
    meta: CreateRuleMeta<TMessageIds>
    defaultOptions: Readonly<TOptions>
    create: (
      context: Readonly<TSESLint.RuleContext<TMessageIds, TOptions>>,
      optionsWithDefault: Readonly<TOptions>,
    ) => TSESLint.RuleListener
  }>,
): TSESLint.RuleModule<TMessageIds, TOptions> {
  const configOverwrite = {
    ...config,
    create: (
      context: Readonly<TSESLint.RuleContext<TMessageIds, TOptions>>,
      optionsWithDefault: Readonly<TOptions>,
    ) => {
      if (
        config.meta.version !== undefined &&
        !ngrxVersionSatisfies(
          MODULE_PATHS[config.meta.module],
          config.meta.version,
        )
      ) {
        return {}
      }

      return config.create(context, optionsWithDefault)
    },
  }

  return ESLintUtils.RuleCreator(docsUrl)(configOverwrite)
}
