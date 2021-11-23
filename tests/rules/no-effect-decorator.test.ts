import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils'
import { stripIndents } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import { test } from 'uvu'
import rule, {
  noEffectDecorator,
  noEffectDecoratorSuggest,
} from '../../src/rules/effects/no-effect-decorator'
import { ruleTester } from '../utils'

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>
type RunTests = TSESLint.RunTests<MessageIds, Options>

const valid: () => RunTests['valid'] = () => [
  `
@Injectable()
export class FixtureEffects {
  effectOK = createEffect(() => this.actions.pipe(
    ofType('PING'),
    map(() => ({ type: 'PONG' }))
  ))
  constructor(private actions: Actions) {}
}`,
]

const invalid: () => TSESLint.InvalidTestCase<MessageIds, []>[] = () => [
  fromFixture(
    stripIndents`
      @Injectable()
      export class FixtureEffects {
        @Effect()
        ~~~~~~~~~ [${noEffectDecorator}]
        effect = this.actions.pipe(
          ofType('PING'),
          map(() => ({ type: 'PONG' }))
        )
        constructor(private actions: Actions) {}
      }`,
    {
      output: stripIndents`
        import { createEffect } from '@ngrx/effects';
        @Injectable()
        export class FixtureEffects {

          effect = createEffect(() => { return this.actions.pipe(
            ofType('PING'),
            map(() => ({ type: 'PONG' }))
          )})
          constructor(private actions: Actions) {}
        }`,
    },
  ),
  fromFixture(
    stripIndents`
      @Injectable()
      export class FixtureEffects {
        @Effect({ dispatch: true })
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noEffectDecorator}]
        effect = this.actions.pipe(
          ofType('PING'),
          map(() => ({ type: 'PONG' }))
        )
        constructor(private actions: Actions) {}
      }`,
    {
      output: stripIndents`
        import { createEffect } from '@ngrx/effects';
        @Injectable()
        export class FixtureEffects {

          effect = createEffect(() => { return this.actions.pipe(
            ofType('PING'),
            map(() => ({ type: 'PONG' }))
          )}, { dispatch: true })
          constructor(private actions: Actions) {}
        }`,
    },
  ),
  fromFixture(
    stripIndents`
      import { createEffect, Effect } from '@ngrx/effects'
      @Injectable()
      export class FixtureEffects {
        @Effect({ dispatch: false })
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noEffectDecorator}]
        effect = this.actions.pipe(
          ofType('PING'),
          mapTo(CustomActions.pong()),
        )
        constructor(private actions: Actions) {}
      }`,
    {
      output: stripIndents`
        import { createEffect, Effect } from '@ngrx/effects'
        @Injectable()
        export class FixtureEffects {

          effect = createEffect(() => { return this.actions.pipe(
            ofType('PING'),
            mapTo(CustomActions.pong()),
          )}, { dispatch: false })
          constructor(private actions: Actions) {}
        }`,
    },
  ),
  fromFixture(
    stripIndents`
      import { Injectable } from '@angular/core'
      import { Effect } from '@ngrx/effects'
      @Injectable()
      export class FixtureEffects {
        @Effect(config)
        ~~~~~~~~~~~~~~~ [${noEffectDecorator}]
        effect = this.actions.pipe(
          ofType('PING'),
          mapTo(CustomActions.pong()),
        )
        constructor(private actions: Actions) {}
      }`,
    {
      output: stripIndents`
        import { Injectable } from '@angular/core'
        import { Effect, createEffect } from '@ngrx/effects'
        @Injectable()
        export class FixtureEffects {

          effect = createEffect(() => { return this.actions.pipe(
            ofType('PING'),
            mapTo(CustomActions.pong()),
          )}, config)
          constructor(private actions: Actions) {}
        }`,
    },
  ),
  {
    code: stripIndents`
      import { Injectable } from '@angular/core'
      import type { OnRunEffects } from '@ngrx/effects'
      @Injectable()
      export class FixtureEffects {
        @Effect(config)
        effect = this.actions.pipe(
          ofType('PING'),
          mapTo(CustomActions.pong()),
        )

        @Effect({ dispatch: false })
        effect2 = createEffect(() => this.actions.pipe(
          ofType('PING'),
          mapTo(CustomActions.pong()),
        ), config)
        constructor(private actions: Actions) {}
      }`,
    output: stripIndents`
      import { createEffect } from '@ngrx/effects';
      import { Injectable } from '@angular/core'
      import type { OnRunEffects } from '@ngrx/effects'
      @Injectable()
      export class FixtureEffects {

        effect = createEffect(() => { return this.actions.pipe(
          ofType('PING'),
          mapTo(CustomActions.pong()),
        )}, config)

        @Effect({ dispatch: false })
        effect2 = createEffect(() => this.actions.pipe(
          ofType('PING'),
          mapTo(CustomActions.pong()),
        ), config)
        constructor(private actions: Actions) {}
      }`,
    errors: [
      { messageId: noEffectDecorator },
      {
        column: 1,
        endColumn: 29,
        line: 11,
        messageId: noEffectDecorator,
        suggestions: [
          {
            messageId: noEffectDecoratorSuggest as MessageIds,
            output: stripIndents`
              import { Injectable } from '@angular/core'
              import type { OnRunEffects } from '@ngrx/effects'
              @Injectable()
              export class FixtureEffects {
                @Effect(config)
                effect = this.actions.pipe(
                  ofType('PING'),
                  mapTo(CustomActions.pong()),
                )


                effect2 = createEffect(() => this.actions.pipe(
                  ofType('PING'),
                  mapTo(CustomActions.pong()),
                ), config)
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
