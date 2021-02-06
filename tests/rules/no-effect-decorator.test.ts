import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  noEffectDecorator,
  noEffectDecoratorSuggest,
  ruleName,
} from '../../src/rules/no-effect-decorator'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    stripIndent`
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
      stripIndent`
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
        output: stripIndent`
        import { createEffect } from '@ngrx/effects';
        @Injectable()
        export class FixtureEffects {
          
          effect = createEffect(() => this.actions.pipe(
            ofType('PING'),
            map(() => ({ type: 'PONG' }))
          ))

          constructor(private actions: Actions) {}
        }`,
      },
    ),
    fromFixture(
      stripIndent`
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
        output: stripIndent`
        import { createEffect } from '@ngrx/effects';
        @Injectable()
        export class FixtureEffects {
          
          effect = createEffect(() => this.actions.pipe(
            ofType('PING'),
            map(() => ({ type: 'PONG' }))
          ), { dispatch: true })

          constructor(private actions: Actions) {}
        }`,
      },
    ),
    fromFixture(
      stripIndent`
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
        output: stripIndent`
        import { createEffect, Effect } from '@ngrx/effects';
        @Injectable()
        export class FixtureEffects {
          
          effect = createEffect(() => this.actions.pipe(
            ofType('PING'),
            mapTo(CustomActions.pong()),
          ), { dispatch: false })

          constructor(private actions: Actions) {}
        }`,
      },
    ),
    fromFixture(
      stripIndent`
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
        output: stripIndent`
        import { Injectable } from '@angular/core';
        import { Effect, createEffect } from '@ngrx/effects';
        @Injectable()
        export class FixtureEffects {
          
          effect = createEffect(() => this.actions.pipe(
            ofType('PING'),
            mapTo(CustomActions.pong()),
          ), config)

          constructor(private actions: Actions) {}
        }`,
      },
    ),
    {
      code: stripIndent`
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
      output: stripIndent`
      import { Injectable } from '@angular/core';
      import { Effect, createEffect } from '@ngrx/effects';
      @Injectable()
      export class FixtureEffects {
        
        effect = createEffect(() => this.actions.pipe(
          ofType('PING'),
          mapTo(CustomActions.pong()),
        ), config)

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
          column: 3,
          endColumn: 31,
          line: 11,
          messageId: noEffectDecorator,
          suggestions: [
            {
              messageId: noEffectDecoratorSuggest,
              output: stripIndent`
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
