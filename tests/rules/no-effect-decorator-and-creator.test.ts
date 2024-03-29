import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils'
import { stripIndents } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import { test } from 'uvu'
import rule, {
  noEffectDecoratorAndCreator,
  noEffectDecoratorAndCreatorSuggest,
} from '../../src/rules/effects/no-effect-decorator-and-creator'
import { ruleTester } from '../utils'

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>
type RunTests = TSESLint.RunTests<MessageIds, Options>

const valid: () => RunTests['valid'] = () => [
  `
    @Injectable()
    export class FixtureEffects {
      creator = createEffect(() => this.actions)
      constructor(private actions: Actions) {}
    }`,
  `
    @Injectable()
    export class FixtureEffects {
      @Effect({ dispatch: false })
      decorator = this.actions
      constructor(private actions: Actions) {}
    }`,
]

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    stripIndents`
        import { Effect } from '@ngrx/effects'
        @Injectable()
        export class FixtureEffects {
          @Effect()
          both = createEffect(() => this.actions)
          ~~~~ [${noEffectDecoratorAndCreator}]
          constructor(private actions: Actions) {}
        }

        @Injectable()
        export class FixtureEffects2 {
          @Effect() source$ = defer(() => {
            return mySocketService.connect()
          })
        }`,
    {
      output: stripIndents`
          import { Effect } from '@ngrx/effects'
          @Injectable()
          export class FixtureEffects {

            both = createEffect(() => this.actions)
            constructor(private actions: Actions) {}
          }

          @Injectable()
          export class FixtureEffects2 {
            @Effect() source$ = defer(() => {
              return mySocketService.connect()
            })
          }`,
    },
  ),
  {
    code: stripIndents`
        import {Effect} from '@ngrx/effects'
        @Injectable()
        export class FixtureEffects {
          @Effect({ dispatch: false })
          both = createEffect(() => this.actions)
          constructor(private actions: Actions) {}
        }`,
    errors: [
      {
        column: 1,
        endColumn: 5,
        line: 5,
        messageId: noEffectDecoratorAndCreator,
        suggestions: [
          {
            messageId: noEffectDecoratorAndCreatorSuggest as MessageIds,
            output:
              '\n' +
              stripIndents`
                @Injectable()
                export class FixtureEffects {

                  both = createEffect(() => this.actions)
                  constructor(private actions: Actions) {}
                }`,
          },
        ],
      },
    ],
  },
]

test(__filename, () => {
  ruleTester().run(path.parse(__filename).name, rule, {
    valid: valid(),
    invalid: invalid(),
  })
})
test.run()
