import { stripIndents } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  noEffectDecorator,
  noEffectDecoratorSuggest,
} from '../../src/rules/effects/no-effect-decorator'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
class Ok {
  effect = createEffect(() => this.actions.pipe(
    ofType('PING'),
    map(() => ({ type: 'PONG' }))
  ))
}`,
  ],
  invalid: [
    fromFixture(
      stripIndents`
class NotOk {
  @Effect()
  ~~~~~~~~~ [${noEffectDecorator}]
  effect = this.actions.pipe(
    ofType('PING'),
    map(() => ({ type: 'PONG' }))
  )
}`,
      {
        output: stripIndents`import { createEffect } from '@ngrx/effects';
class NotOk {

  effect = createEffect(() => { return this.actions.pipe(
    ofType('PING'),
    map(() => ({ type: 'PONG' }))
  )})
}`,
      },
    ),
    fromFixture(
      stripIndents`
class NotOk1 {
  @Effect({ dispatch: true })
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noEffectDecorator}]
  effect = this.actions.pipe(
    ofType('PING'),
    map(() => ({ type: 'PONG' }))
  )
}`,
      {
        output: stripIndents`import { createEffect } from '@ngrx/effects';
class NotOk1 {

  effect = createEffect(() => { return this.actions.pipe(
    ofType('PING'),
    map(() => ({ type: 'PONG' }))
  )}, { dispatch: true })
}`,
      },
    ),
    fromFixture(
      stripIndents`
import { createEffect, Effect } from '@ngrx/effects'

class NotOk2 {
  @Effect({ dispatch: false })
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noEffectDecorator}]
  effect = this.actions.pipe(
    ofType('PING'),
    mapTo(CustomActions.pong()),
  )
}`,
      {
        output: stripIndents`
import { createEffect, Effect } from '@ngrx/effects'

class NotOk2 {

  effect = createEffect(() => { return this.actions.pipe(
    ofType('PING'),
    mapTo(CustomActions.pong()),
  )}, { dispatch: false })
}`,
      },
    ),
    fromFixture(
      stripIndents`
import { Effect } from '@ngrx/effects'

class NotOk3 {
  @Effect(config)
  ~~~~~~~~~~~~~~~ [${noEffectDecorator}]
  effect = this.actions.pipe(
    ofType('PING'),
    mapTo(CustomActions.pong()),
  )
}`,
      {
        output: stripIndents`
import { Effect, createEffect } from '@ngrx/effects'

class NotOk3 {

  effect = createEffect(() => { return this.actions.pipe(
    ofType('PING'),
    mapTo(CustomActions.pong()),
  )}, config)
}`,
      },
    ),
    fromFixture(
      stripIndents`
import type { OnRunEffects } from '@ngrx/effects'

class NotOk4 {
  @Effect(config)
  ~~~~~~~~~~~~~~~ [${noEffectDecorator}]
  effect = this.actions.pipe(
    ofType('PING'),
    mapTo(CustomActions.pong()),
  )
}`,
      {
        output: stripIndents`
import { createEffect } from '@ngrx/effects';
import type { OnRunEffects } from '@ngrx/effects'

class NotOk4 {

  effect = createEffect(() => { return this.actions.pipe(
    ofType('PING'),
    mapTo(CustomActions.pong()),
  )}, config)
}`,
      },
    ),
    fromFixture(
      stripIndents`
import { createEffect } from '@ngrx/effects';

class NotOk5 {
  @Effect({ dispatch: false })
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noEffectDecorator}]
  effect = createEffect(() => this.actions.pipe(
    ofType('PING'),
    mapTo(CustomActions.pong()),
  ), config)
}`,
      {
        suggestions: [
          {
            messageId: noEffectDecoratorSuggest,
            output: stripIndents`
import { createEffect } from '@ngrx/effects';

class NotOk5 {

  effect = createEffect(() => this.actions.pipe(
    ofType('PING'),
    mapTo(CustomActions.pong()),
  ), config)
}`,
          },
        ],
      },
    ),
  ],
})
