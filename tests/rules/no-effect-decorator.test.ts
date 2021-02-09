import { stripIndents } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  noEffectDecorator,
  noEffectDecoratorSuggest,
  ruleName,
} from '../../src/rules/no-effect-decorator'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    stripIndents`
      @Injectable()
      export class FixtureEffects {

      effectOK = createEffect(() => this.actions.pipe(
        ofType('PING'),
        map(() => ({ type: 'PONG' }))
      ))

      constructor(private actions: Actions) {}
    }`,
  ],
  invalid: [
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
      import { createEffect, Effect } from '@ngrx/effects';
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
        import { createEffect, Effect } from '@ngrx/effects';
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
      import { Injectable } from '@angular/core';
      import { Effect } from '@ngrx/effects';
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
        import { Injectable } from '@angular/core';
        import { Effect, createEffect } from '@ngrx/effects';
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
      import { Injectable } from '@angular/core';
      import { Effect } from '@ngrx/effects';
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
      import { Injectable } from '@angular/core';
      import { Effect, createEffect } from '@ngrx/effects';
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
              messageId: noEffectDecoratorSuggest,
              output: stripIndents`
              import { Injectable } from '@angular/core';
              import { Effect } from '@ngrx/effects';
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
  ],
})
