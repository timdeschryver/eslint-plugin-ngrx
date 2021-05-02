import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/store/avoid-dispatching-multiple-actions-sequentially'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      import { Store } from '@ngrx/store'

      @Component()
      export class FixtureComponent {
        constructor(private store: Store){}
        ping() {
          this.store.dispatch({ type: 'PING' })
        }
      }`,
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/47
    `
      import { Store } from '@ngrx/store'

      @Component()
      export class FixtureComponent {
        valid = false;
        constructor(private store: Store){}

        pingPong() {
          if (this.valid) {
            this.store.dispatch({ type: 'PING' })
          } else {
            this.store.dispatch({ type: 'PONG' })
          }
        }
      }`,
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/86
    `
    import { Store } from '@ngrx/store'

    @Component()
    export class FixtureComponent {
      valid = false;
      constructor(private store: Store){}

      ngOnInit() {
        this.store.subscribe(() => {
          this.store.dispatch({ type : 'one' });
        });
        this.store.subscribe(() => {
          this.store.dispatch({ type : 'another-one' });
        });
      }
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store'

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
      import { Store } from '@ngrx/store'

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
      import { Store } from '@ngrx/store'

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
      import { Store } from '@ngrx/store'

      @Component()
      export class FixtureComponent {
        constructor(private customName: Store){}

        pingPong() {
          this.customName.dispatch({ type: 'PING' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          this.customName.dispatch({ type: 'PONG' })
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      }`,
    ),
  ],
})
