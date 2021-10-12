import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import { test } from 'uvu'
import rule, {
  messageId,
} from '../../src/rules/effects/use-effects-lifecycle-interface'
import { ruleTester } from '../utils'

const valid = [
  `
      class Foo {}
    `,
  `
      class UserEffects implements OnInitEffects {
        ngrxOnInitEffects(): Action {
          return { type: '[UserEffects]: Init' }
        }
      }
    `,
  `
      export class UserEffects implements OnRunEffects {
        constructor(private actions$: Actions) {}
        updateUser$ = createEffect(() =>
            this.actions$.pipe(
              ofType('UPDATE_USER'),
              tap(action => {
                console.log(action)
              })
            ),
          { dispatch: false })
        ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
          return this.actions$.pipe(
            ofType('LOGGED_IN'),
            exhaustMap(() =>
              resolvedEffects$.pipe(
                takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
              )
            )
          )
        }
      }
    `,
  `
      class EffectWithIdentifier implements OnIdentifyEffects {
        constructor(private effectIdentifier: string) {}
        ngrxOnIdentifyEffects() {
          return this.effectIdentifier
        }
      }
    `,
  `
      class UserEffects implements ngrx.OnInitEffects, OnIdentifyEffects {
        ngrxOnInitEffects(): Action {
          return { type: '[UserEffects]: Init' }
        }
        ngrxOnIdentifyEffects(): string {
          return ''
        }
      }
    `,
]

const invalid = [
  fromFixture(
    stripIndent`
        class UserEffects {
          ngrxOnInitEffects() {}
          ~~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnInitEffects", "methodName": "ngrxOnInitEffects" }]
        }
      `,
    {
      output: stripIndent`
          import { OnInitEffects } from '@ngrx/effects';
          class UserEffects implements OnInitEffects {
            ngrxOnInitEffects() {}
          }
        `,
    },
  ),
  fromFixture(
    stripIndent`
        import Effects from '@ngrx/effects'
        class UserEffects {
          ngrxOnIdentifyEffects() {}
          ~~~~~~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnIdentifyEffects", "methodName": "ngrxOnIdentifyEffects" }]
        }
      `,
    {
      output: stripIndent`
          import Effects, { OnIdentifyEffects } from '@ngrx/effects'
          class UserEffects implements OnIdentifyEffects {
            ngrxOnIdentifyEffects() {}
          }
        `,
    },
  ),
  fromFixture(
    stripIndent`
        import { Injectable } from '@angular/core'
        class UserEffects {
          ngrxOnRunEffects() {}
          ~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnRunEffects", "methodName": "ngrxOnRunEffects" }]
        }
      `,
    {
      output: stripIndent`
          import { OnRunEffects } from '@ngrx/effects';
          import { Injectable } from '@angular/core'
          class UserEffects implements OnRunEffects {
            ngrxOnRunEffects() {}
          }
        `,
    },
  ),
  fromFixture(
    stripIndent`
        import * as ngrx from '@ngrx/effects'
        class UserEffects {
          ngrxOnInitEffects() {}
          ~~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnInitEffects", "methodName": "ngrxOnInitEffects" }]
        }
      `,
    {
      output: stripIndent`
          import { OnInitEffects } from '@ngrx/effects';
          import * as ngrx from '@ngrx/effects'
          class UserEffects implements OnInitEffects {
            ngrxOnInitEffects() {}
          }
        `,
    },
  ),
  fromFixture(
    stripIndent`
        import type { OnInitEffects, OnRunEffects } from '@ngrx/effects'
        class UserEffects implements OnInitEffects, OnRunEffects {
          ngrxOnInitEffects() {}

          ngrxOnIdentifyEffects() {}
          ~~~~~~~~~~~~~~~~~~~~~ [${messageId} { "interfaceName": "OnIdentifyEffects", "methodName": "ngrxOnIdentifyEffects" }]

          ngrxOnRunEffects() {}
        }
      `,
    {
      output: stripIndent`
          import type { OnInitEffects, OnRunEffects, OnIdentifyEffects } from '@ngrx/effects'
          class UserEffects implements OnInitEffects, OnRunEffects, OnIdentifyEffects {
            ngrxOnInitEffects() {}

            ngrxOnIdentifyEffects() {}

            ngrxOnRunEffects() {}
          }
        `,
    },
  ),
]

test(__filename, () => {
  ruleTester().run(path.parse(__filename).name, rule, { valid, invalid })
})
test.run()
