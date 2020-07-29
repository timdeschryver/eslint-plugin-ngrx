import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/avoid-dispatching-multiple-actions-sequentially'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `
      @Component()
      export class FixtureComponent {
        constructor(private store: Store){}
        ping() {
          this.store.dispatch({ type: 'PING' })
        }
      }`,
    `
      @Component()
      export class FixtureComponent {
        valid = false;
        constructor(private store: Store){}

        pingPong() {
          if (this.valid) {
            this.store.dispatch({ type: 'PING' })
          }
        }
      }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      @Component()
      export class FixtureComponent {
        constructor(private store: Store){}

        pingPong() {
          this.store.dispatch({ type: 'PING' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          this.store.dispatch({ type: 'PONG' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      }`,
    ),
    fromFixture(
      stripIndent`
      @Component()
      export class FixtureComponent {
        constructor(private store: Store){}

        pong() {
          this.store.dispatch({ type: 'PING' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          this.ping();
          this.name = 'Bob'
          this.store.dispatch({ type: 'PONG' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      }`,
    ),
    fromFixture(
      stripIndent`
      @Component()
      export class FixtureComponent {
        constructor(private store: Store){}

        pingPongPong() {
          this.store.dispatch({ type: 'PING' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          this.store.dispatch({ type: 'PONG' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          this.store.dispatch({ type: 'PONG' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      }`,
    ),
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/44
    fromFixture(
      stripIndent`
      @Component()
      export class FixtureComponent {
        constructor(private store$: Store){}

        pingPong() {
          this.store$.dispatch({ type: 'PING' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          this.store$.dispatch({ type: 'PONG' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      }`,
    ),
  ],
})
