import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/experimental-utils/dist/ts-eslint'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import { test } from 'uvu'
import type { MessageIds } from '../../src/rules/store/select-style'
import rule, {
  methodSelectMessageId,
  operatorSelectMessageId,
  SelectStyle,
} from '../../src/rules/store/select-style'
import { ruleTester } from '../utils'

const valid: (string | ValidTestCase<SelectStyle[]>)[] = [
  `
import { Store } from '@ngrx/store'

class Ok {
  readonly test$ = somethingOutside();
}`,
  `
import { Store } from '@ngrx/store'

class Ok1 {
  constructor(private store: Store) {}
}`,
  `
import { Store, select } from '@ngrx/store'

class Ok2 {
  constructor(private store: Store) {}
}`,
  `
import { Store, select } from '@ngrx/store'

class Ok3 {
  foo$ = select(selector)

  constructor(private store: Store) {}
}`,
  `
import { select } from '@my-org/framework'
import { Store } from '@ngrx/store'

class Ok4 {
  foo$ = this.store.pipe(select(selector))

  constructor(private store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok5 {
  foo$ = this.store.select(selector)

  constructor(private store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok6 {
  foo$ = this.store.select(selector)

  constructor(private store: Store) {}
}`,
  `
import { Store, select } from '@ngrx/store'

class Ok7 {
  foo$ = this.customName.select(selector)
  constructor(private customName: Store) {}
}`,
  {
    code: `
import { Store, select } from '@ngrx/store'

class Ok8 {
  foo$ = this.store.pipe(select(selector))

  constructor(private store: Store) {}
}`,
    options: [SelectStyle.Operator],
  },
  {
    code: `
import { select, Store } from '@ngrx/store'

class Ok9 {
  foo$ = this.store.select(selector)

  constructor(private store: Store) {}
}`,
    options: [SelectStyle.Method],
  },
]

const invalid: InvalidTestCase<MessageIds, SelectStyle[]>[] = [
  fromFixture(
    `
import { select, Store } from '@ngrx/store'
         ~~~~~~ [${methodSelectMessageId}]

class NotOk {
  foo$ = this.store.pipe( select(selector), )
                          ~~~~~~ [${methodSelectMessageId}]

  constructor(private store: Store) {}
}`,
    {
      output: `
import {  Store } from '@ngrx/store'

class NotOk {
  foo$ = this.store. select((selector), )

  constructor(private store: Store) {}
}`,
    },
  ),
  fromFixture(
    `
import { Store, select } from '@ngrx/store'
                ~~~~~~ [${methodSelectMessageId}]

class NotOk1 {
  foo$ = this.store.pipe  (select
                           ~~~~~~ [${methodSelectMessageId}]
    (selector, selector2), filter(Boolean))

  constructor(private store: Store) {}
}`,
    {
      options: [SelectStyle.Method],
      output: `
import { Store } from '@ngrx/store'

class NotOk1 {
  foo$ = this.store.select
    (selector, selector2).pipe  ( filter(Boolean))

  constructor(private store: Store) {}
}`,
    },
  ),
  fromFixture(
    `
import { select, Store } from '@ngrx/store'

class NotOk2 {
  bar$: Observable<unknown>
  foo$: Observable<unknown>

  constructor(store: Store, private readonly customStore: Store) {
    this.foo$ = store.select(
                      ~~~~~~ [${operatorSelectMessageId}]
      selector,
    )
  }

  ngOnInit() {
    this.bar$ = this.customStore.select(
                                 ~~~~~~ [${operatorSelectMessageId}]
      selector,
    )
  }
}`,
    {
      options: [SelectStyle.Operator],
      output: `
import { select, Store } from '@ngrx/store'

class NotOk2 {
  bar$: Observable<unknown>
  foo$: Observable<unknown>

  constructor(store: Store, private readonly customStore: Store) {
    this.foo$ = store.pipe(select(
      selector,
    ))
  }

  ngOnInit() {
    this.bar$ = this.customStore.pipe(select(
      selector,
    ))
  }
}`,
    },
  ),
  fromFixture(
    `
import {
  Store,
  select,
  ~~~~~~ [${methodSelectMessageId}]
} from '@ngrx/store'

class NotOk3 {
  foo$ = this.store.pipe(select(selector), map(toItem)).pipe()
                         ~~~~~~ [${methodSelectMessageId}]
  bar$ = this.store.
    select(selector).pipe()
  baz$ = this.store.pipe(
    select(({ customers }) => customers), map(toItem),
    ~~~~~~ [${methodSelectMessageId}]
  ).pipe()

  constructor(private store: Store) {}
}

class NotOk4 {
  foo$ = this.store.pipe(select(selector), map(toItem)).pipe()
                         ~~~~~~ [${methodSelectMessageId}]

  constructor(private readonly store: Store) {}
}`,
    {
      options: [SelectStyle.Method],
      output: `
import {
  Store,
} from '@ngrx/store'

class NotOk3 {
  foo$ = this.store.select(selector).pipe( map(toItem)).pipe()
  bar$ = this.store.
    select(selector).pipe()
  baz$ = this.store.select(({ customers }) => customers).pipe(
     map(toItem),
  ).pipe()

  constructor(private store: Store) {}
}

class NotOk4 {
  foo$ = this.store.select(selector).pipe( map(toItem)).pipe()

  constructor(private readonly store: Store) {}
}`,
    },
  ),
  fromFixture(
    `
import type {Creator} from '@ngrx/store'
import { Store } from '@ngrx/store'

class NotOk5 {
  foo$ = this.store.select(selector)
                    ~~~~~~ [${operatorSelectMessageId}]

  constructor(private store: Store) {}
}`,
    {
      options: [SelectStyle.Operator],
      output: `
import type {Creator} from '@ngrx/store'
import { Store, select } from '@ngrx/store'

class NotOk5 {
  foo$ = this.store.pipe(select(selector))

  constructor(private store: Store) {}
}`,
    },
  ),
]

test(__filename, () => {
  ruleTester().run(path.parse(__filename).name, rule, {
    valid: valid as (
      | string
      | ValidTestCase<readonly ['operator' | 'method']>
    )[],
    invalid: invalid as InvalidTestCase<
      MessageIds,
      readonly ['operator' | 'method']
    >[],
  })
})
test.run()
