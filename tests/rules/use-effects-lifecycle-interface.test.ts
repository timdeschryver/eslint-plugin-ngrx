import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/effects/use-effects-lifecycle-interface'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
class Ok {}`,
    `
class Ok1 implements OnInitEffects {
  ngrxOnInitEffects(): Action {
    return { type: '[UserEffects]: Init' }
  }
}`,
    `
class Ok2 implements OnRunEffects {
  constructor(private readonly actions$: Actions) {}

  ngrxOnRunEffects(resolvedEffects$: Observable<EffectNotification>) {
    return this.actions$.pipe(
      ofType(AuthActions.loggedIn),
      exhaustMap(() =>
        resolvedEffects$.pipe(
          takeUntil(this.actions$.pipe(ofType('LOGGED_OUT')))
        )
      )
    )
  }
}`,
    `
class Ok3 implements OnIdentifyEffects {
  constructor(private effectIdentifier: string) {}

  ngrxOnIdentifyEffects() {
    return this.effectIdentifier
  }
}`,
    `
class Ok4 implements ngrx.OnInitEffects, OnIdentifyEffects {
  ngrxOnInitEffects() {}

  ngrxOnIdentifyEffects() {}
}`,
  ],
  invalid: [
    fromFixture(
      `
class NotOk {
      ~~~~~ [${messageId} { "interfaceName": "OnInitEffects", "methodName": "ngrxOnInitEffects" }]
  ngrxOnInitEffects() {}
}`,
      {
        output: `import { OnInitEffects } from '@ngrx/effects';

class NotOk implements OnInitEffects {
  ngrxOnInitEffects() {}
}`,
      },
    ),
    fromFixture(
      `
import Effects from '@ngrx/effects'

class NotOk1 {
      ~~~~~~ [${messageId} { "interfaceName": "OnIdentifyEffects", "methodName": "ngrxOnIdentifyEffects" }]
  ngrxOnIdentifyEffects() {}
}`,
      {
        output: `
import Effects, { OnIdentifyEffects } from '@ngrx/effects'

class NotOk1 implements OnIdentifyEffects {
  ngrxOnIdentifyEffects() {}
}`,
      },
    ),
    fromFixture(
      `
import { Injectable } from '@angular/core'

class NotOk2 {
      ~~~~~~ [${messageId} { "interfaceName": "OnRunEffects", "methodName": "ngrxOnRunEffects" }]
  ngrxOnRunEffects() {}
}`,
      {
        output: `import { OnRunEffects } from '@ngrx/effects';

import { Injectable } from '@angular/core'

class NotOk2 implements OnRunEffects {
  ngrxOnRunEffects() {}
}`,
      },
    ),
    fromFixture(
      `
import * as ngrx from '@ngrx/effects'

class NotOk3 {
      ~~~~~~ [${messageId} { "interfaceName": "OnInitEffects", "methodName": "ngrxOnInitEffects" }]
  ngrxOnInitEffects() {}
}`,
      {
        output: `import { OnInitEffects } from '@ngrx/effects';

import * as ngrx from '@ngrx/effects'

class NotOk3 implements OnInitEffects {
  ngrxOnInitEffects() {}
}`,
      },
    ),
    fromFixture(
      `
import type { OnInitEffects, OnRunEffects } from '@ngrx/effects'

class NotOk4 implements OnInitEffects, OnRunEffects {
      ~~~~~~ [${messageId} { "interfaceName": "OnIdentifyEffects", "methodName": "ngrxOnIdentifyEffects" }]
  ngrxOnInitEffects() {}

  ngrxOnIdentifyEffects() {}

  ngrxOnRunEffects() {}
}`,
      {
        output: `
import type { OnInitEffects, OnRunEffects, OnIdentifyEffects } from '@ngrx/effects'

class NotOk4 implements OnInitEffects, OnRunEffects, OnIdentifyEffects {
  ngrxOnInitEffects() {}

  ngrxOnIdentifyEffects() {}

  ngrxOnRunEffects() {}
}`,
      },
    ),
  ],
})
