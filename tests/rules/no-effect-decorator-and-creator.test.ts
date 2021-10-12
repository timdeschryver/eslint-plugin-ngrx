import { stripIndents } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  noEffectDecoratorAndCreator,
  noEffectDecoratorAndCreatorSuggest,
} from '../../src/rules/effects/no-effect-decorator-and-creator'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
class Ok {
  effect = createEffect(() => this.actions)

  constructor(private actions: Actions) {}
}`,
    `
class Ok1 {
  @Effect({ dispatch: false })
  effect = this.actions

  constructor(private actions: Actions) {}
}`,
  ],
  invalid: [
    fromFixture(
      stripIndents`
import { Effect } from '@ngrx/effects'

class NotOk {
  @Effect()
  effect = createEffect(() => this.actions)
  ~~~~~~ [${noEffectDecoratorAndCreator}]

  constructor(private actions: Actions) {}
}


class NotOk1 {
  @Effect() source$ = defer(() => {
    return mySocketService.connect()
  })
}`,
      {
        output: stripIndents`
import { Effect } from '@ngrx/effects'

class NotOk {

  effect = createEffect(() => this.actions)

  constructor(private actions: Actions) {}
}


class NotOk1 {
  @Effect() source$ = defer(() => {
    return mySocketService.connect()
  })
}`,
      },
    ),
    fromFixture(
      stripIndents`import {Effect} from '@ngrx/effects'
class NotOk2 {
  @Effect({ dispatch: false })
  effect = createEffect(() => this.actions)
  ~~~~~~ [${noEffectDecoratorAndCreator}]

  constructor(private actions: Actions) {}
}`,
      {
        suggestions: [
          {
            messageId: noEffectDecoratorAndCreatorSuggest,
            output:
              '\n' +
              stripIndents`
class NotOk2 {

  effect = createEffect(() => this.actions)

  constructor(private actions: Actions) {}
}`,
          },
        ],
      },
    ),
  ],
})
