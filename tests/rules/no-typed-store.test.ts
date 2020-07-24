import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, { ruleName, messageId } from '../../src/rules/no-typed-store'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    stripIndent`
    export class Ok {
      constructor(store: Store)
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        export class NotOk {
          constructor(store: Store<PersonsState>){}
                             ~~~~~~~~~~~~~~~~~~~  [${messageId}]
        }`,
    ),
    fromFixture(
      stripIndent`
        export class NotOk2 {
          constructor(cdr: ChangeDetectionRef, private store: Store<CustomersState>){}
                                                              ~~~~~~~~~~~~~~~~~~~~~  [${messageId}]
        }`,
    ),
    fromFixture(
      stripIndent`
      export class NotOk3 {
        constructor(private store: Store<any>, private personsService: PersonsService){}
                                   ~~~~~~~~~~  [${messageId}]
      }`,
    ),
    fromFixture(
      stripIndent`
      export class NotOk4 {
        constructor(store: Store<{}>)
                           ~~~~~~~~~  [${messageId}]
      }`,
    ),
    fromFixture(
      stripIndent`
      export class NotOk5 {
          constructor(store: Store<object>)
                             ~~~~~~~~~~~~~  [${messageId}]
        }`,
    ),
  ],
})
