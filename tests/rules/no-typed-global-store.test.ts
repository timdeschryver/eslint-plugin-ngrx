import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import { test } from 'uvu'
import rule, {
  noTypedStore,
  noTypedStoreSuggest,
} from '../../src/rules/store/no-typed-global-store'
import { ruleTester } from '../utils'

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>
type RunTests = TSESLint.RunTests<MessageIds, Options>

const valid: RunTests['valid'] = [
  `
import { Store } from '@ngrx/store'

export class Ok {
  constructor(store: Store) {}
}`,
]

const invalid: RunTests['invalid'] = [
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk {
  constructor(store: Store<PersonsState>) {}
                          ~~~~~~~~~~~~~~ [${noTypedStore}]
}`,
    {
      suggestions: [
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk {
  constructor(store: Store) {}
}`,
        },
      ],
    },
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(cdr: ChangeDetectorRef, private store: Store<CustomersState>) {}
                                                          ~~~~~~~~~~~~~~~~ [${noTypedStore}]
}`,
    {
      suggestions: [
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(cdr: ChangeDetectorRef, private store: Store) {}
}`,
        },
      ],
    },
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store: Store<any>, private personsService: PersonsService) {}
                                           ~~~~~ [${noTypedStore}]
}`,
    {
      suggestions: [
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store: Store, private personsService: PersonsService) {}
}`,
        },
      ],
    },
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(store: Store<{}>, private customStore: Store<object>) {}
                          ~~~~ [${noTypedStore} suggest 0]
                                                          ~~~~~~~~ [${noTypedStore} suggest 1]
}`,
    {
      suggestions: [
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(store: Store, private customStore: Store<object>) {}
}`,
        },
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(store: Store<{}>, private customStore: Store) {}
}`,
        },
      ],
    },
  ),
]

test(__filename, () => {
  ruleTester().run(path.parse(__filename).name, rule, { valid, invalid })
})
test.run()
