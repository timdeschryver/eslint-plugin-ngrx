import { fromFixture } from 'eslint-etc'
import path from 'path'
import { test } from 'uvu'
import rule, {
  useConsistentGlobalStoreName,
  useConsistentGlobalStoreNameSuggest,
} from '../../src/rules/store/use-consistent-global-store-name'
import { ruleTester } from '../utils'

const valid = [
  `
class Ok {}`,
  `
import { Store } from '@ngrx/store'

class Ok1 {
  constructor(store: Store) {}
}`,
  {
    code: `
import { Store } from '@ngrx/store'

class Ok2 {
  constructor(private customName: Store) {}
}`,
    options: ['customName'],
  },
]

const invalid = [
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk {
  constructor(private readonly somethingElse$: Store) {}
                               ~~~~~~~~~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" }]
}`,
    {
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk {
  constructor(private readonly store: Store) {}
}`,
        },
      ],
    },
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(private readonly store1: Store, private readonly store: Store) {}
                               ~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" }]
}`,
    {
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(private readonly store: Store, private readonly store: Store) {}
}`,
        },
      ],
    },
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store1: Store, private readonly store2: Store) {}
                               ~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest 0]
                                                               ~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest 1]
}`,
    {
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store: Store, private readonly store2: Store) {}
}`,
        },
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store1: Store, private readonly store: Store) {}
}`,
        },
      ],
    },
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(private store: Store) {}
                      ~~~~~ [${useConsistentGlobalStoreName} { "storeName": "customName" }]
}`,
    {
      options: ['customName'],
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'customName',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(private customName: Store) {}
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
