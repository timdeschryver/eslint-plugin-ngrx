import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/use-lifecycle-interface'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `
      class Foo {}
    `,
    `
      class UserEffects implements OnInitEffects {
        ngrxOnInitEffects(): Action {
          return { type: '[UserEffects]: Init' };
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
                console.log(action);
              })
            ),
          { dispatch: false });
        ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
          return this.actions$.pipe(
            ofType('LOGGED_IN'),
            exhaustMap(() =>
              resolvedEffects$.pipe(
                takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
              )
            )
          );
        }
      }
    `,
    `
     class EffectWithIdentifier implements OnIdentifyEffects {
        constructor(private effectIdentifier: string) {}
        ngrxOnIdentifyEffects() {
          return this.effectIdentifier;
        }
      }
    `,
    `
      class UserEffects implements OnInitEffects, OnIdentifyEffects {
        ngrxOnInitEffects(): Action {
          return { type: '[UserEffects]: Init' };
        }
        ngrxOnIdentifyEffects(): string {
          return '';
        }
      }
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        class UserEffects {
          ngrxOnInitEffects() {
          ~~~~~~~~~~~~~~~~~   [${messageId} { "interfaceName": "OnInitEffects", "methodName": "ngrxOnInitEffects" }]
          }
        }
      `,
    ),
    fromFixture(
      stripIndent`
        class UserEffects {
          ngrxOnIdentifyEffects() {
          ~~~~~~~~~~~~~~~~~~~~~   [${messageId} { "interfaceName": "OnIdentifyEffects", "methodName": "ngrxOnIdentifyEffects" }]
          }
        }
      `,
    ),
    fromFixture(
      stripIndent`
        class UserEffects {
          ngrxOnRunEffects() {
          ~~~~~~~~~~~~~~~~   [${messageId} { "interfaceName": "OnRunEffects", "methodName": "ngrxOnRunEffects" }]
          }
        }
      `,
    ),
  ],
})
