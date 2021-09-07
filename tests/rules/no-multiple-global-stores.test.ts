import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/store/no-multiple-global-stores'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `export class NoCtorOK {}`,
    `
    export class EmptyOk {
      constructor() {}
    }`,
    `
    export class OneWithVisibilityOk {
      constructor(private store: Store) {}
    }`,
    `
    export class OneWithoutVisibilityOk {
      constructor(store: Store) {}
    }`,
    `
    export class OnePlusExtraOk {
      constructor(private store: Store, data: Service) {}
    }`,
    `
    export class FirstOk {
      constructor(private store: Store, data: Service) {}
    }

    export class SecondOk {
      constructor(private store: Store, data: Service) {}
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        export class NotOkNoVisibility {
          constructor(store: Store, store2: Store) {}
                      ~~~~~~~~~~~~                  [${messageId}]
                                    ~~~~~~~~~~~~~   [${messageId}]
        }`,
    ),
    fromFixture(
      stripIndent`
        export class NotOkOneVisibility {
          constructor(store: Store, private store2: Store) {}
                      ~~~~~~~~~~~~                        [${messageId}]
                                            ~~~~~~~~~~~~~ [${messageId}]
        }`,
    ),
    fromFixture(
      stripIndent`
        export class NotOkBothVisibility {
          constructor(private readonly store: Store, private store2: Store) {}
                                       ~~~~~~~~~~~~                          [${messageId}]
                                                             ~~~~~~~~~~~~~   [${messageId}]
        }`,
    ),
    fromFixture(
      stripIndent`
        export class NotOkMultipleErrors {
          constructor(private readonly store: Store, private store2: Store, private store3: Store) {}
                                       ~~~~~~~~~~~~                                                [${messageId}]
                                                             ~~~~~~~~~~~~~                         [${messageId}]
                                                                                    ~~~~~~~~~~~~~  [${messageId}]
        }`,
    ),
  ],
})
