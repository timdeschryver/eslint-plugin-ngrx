import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, { ruleName, messageId } from '../../src/rules/no-multiple-stores'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `export class NoCtorOK {}`,
    `
    export class EmptyOk {
      constructor(){}
    }`,
    `
    export class OneWithVisibilityOk {
      constructor(private store: Store){}
    }`,
    `
    export class OneWithoutVisibilityOk {
      constructor(store: Store){}
    }`,
    `
    export class OnePlusExtraOk {
      constructor(private store: Store, data: Service){}
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        export class NotOkNoVisibility {
          constructor(store: Store, store2: Store){}
                      ~~~~~~~~~~~~                  [${messageId}]
                                    ~~~~~~~~~~~~~   [${messageId}]
        }`,
    ),
    fromFixture(
      stripIndent`
        export class NotOkOneVisibility {
          constructor(store: Store, private store2: Store){}
                      ~~~~~~~~~~~~                        [${messageId}]
                                            ~~~~~~~~~~~~~ [${messageId}]
        }`,
    ),
    fromFixture(
      stripIndent`
        export class NotOkBothVisibility {
          constructor(private readonly store: Store, private store2: Store){}
                                       ~~~~~~~~~~~~                          [${messageId}]
                                                             ~~~~~~~~~~~~~   [${messageId}]
        }`,
    ),
    fromFixture(
      stripIndent`
        export class NotOkMultipleErrors {
          constructor(private readonly store: Store, private store2: Store, private store3: Store){}
                                       ~~~~~~~~~~~~                                                [${messageId}]
                                                             ~~~~~~~~~~~~~                         [${messageId}]
                                                                                    ~~~~~~~~~~~~~  [${messageId}]
        }`,
    ),
  ],
})
