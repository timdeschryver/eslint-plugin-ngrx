import { stripIndent } from 'common-tags'
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
      name = 'Tim'
      constructor(private store: Store<{}>){}

      ping() {
        this.store.dispatch({ type: 'PING' })
      }
    }`,
  ],
  invalid: [
    {
      code: stripIndent`
      @Component()
      export class FixtureComponent {
        name = 'Tim'
        constructor(private store: Store<{}>){}

        pingPong() {
          this.store.dispatch({ type: 'PING' })
          this.store.dispatch({ type: 'PONG' })
        }
      }`,
      errors: [
        {
          messageId,
          line: 8,
          column: 5,
          endLine: 8,
          endColumn: 42,
        },
      ],
    },
    {
      code: stripIndent`
      @Component()
      export class FixtureComponent {
        name = 'Tim'
        constructor(private store: Store<{}>){}

        pong() {
          this.store.dispatch({ type: 'PING' })
          this.ping();
          this.name = 'Bob'
          this.store.dispatch({ type: 'PONG' })
        }
      }`,
      errors: [
        {
          messageId,
          line: 10,
          column: 5,
          endLine: 10,
          endColumn: 42,
        },
      ],
    },
    {
      code: stripIndent`
      @Component()
      export class FixtureComponent {
        name = 'Tim'
        constructor(private store: Store<{}>){}

        pingPongPong() {
          this.store.dispatch({ type: 'PING' })
          this.store.dispatch({ type: 'PONG' })
          this.store.dispatch({ type: 'PONG' })
        }
      }`,
      errors: [
        {
          messageId,
          line: 8,
          column: 5,
          endLine: 8,
          endColumn: 42,
        },
        {
          messageId,
          line: 9,
          column: 5,
          endLine: 9,
          endColumn: 42,
        },
      ],
    },
  ],
})
