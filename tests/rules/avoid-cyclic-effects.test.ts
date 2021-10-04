import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/effects/avoid-cyclic-effects'
import { ruleTester } from '../utils'

const setup = `
  import { Injectable } from '@angular/core'
  import type { OnRunEffects } from '@ngrx/effects'
  import { Actions, createEffect, CreateEffectMetadata, EffectConfig, ofType } from '@ngrx/effects'
  import { Action, createAction } from '@ngrx/store'
  import { of } from 'rxjs'
  import { exhaustMap, map, mergeMapTo, switchMap, switchMapTo, tap } from 'rxjs/operators'

  const foo = createAction('FOO')
  const bar = createAction('BAR')
  const subject = 'SUBJECT'
  const genericFoo = createAction(\`\${subject} FOO\`)
  const genericBar = createAction(\`\${subject} BAR\`)
  const fromFoo = { foo, bar }
  const EMPTY_OBJECT = {}
  const UNDEFINED = undefined
  let shouldDispatch: boolean
  const dispatchAny = { dispatch: false } as any
  const dispatchNullable = { dispatch: true } as { dispatch: true } | null
  const configDispatchTrue = { dispatch: true } as const
  const dispatch = false
  const dispatchKey = 'dispatch'

  function getEffectConfig() {
    return { dispatch } as const
  }
`

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      ${setup}
      @Injectable()
      class Effect {
        foo$ = createEffect(() => {
          return this.layoutObserver.screenType$.pipe(
            map((screenType) => LayoutActions.setScreenType({ screenType })),
          )
        })

        constructor(private layoutObserver: LayoutObserver) {}
      }
    `,
    `
      ${setup}
      @Injectable()
      class Effect {
        foo$ = createEffect(() =>
          this.actions$.pipe(
            ofType(foo),
            switchMap(() => of(bar())),
          ),
        )

        constructor(private actions$: Actions) {}
      }
    `,
    `
      ${setup}
      @Injectable()
      class Effect {
        foo$ = createEffect(() => {
          return this.actions$.pipe(
            ofType(foo),
            exhaustMap(() => [bar(), genericBar()]),
          )
        })

        constructor(private actions$: Actions) {}
      }
    `,
    `
      ${setup}
      @Injectable()
      class Effect {
        bar$ = createEffect(() =>
          this.actions$.pipe(
            ofType(genericFoo),
            switchMapTo(genericBar()),
          ),
        )
        foo$ = createEffect(() => {
          return this.actions$.pipe(
            ofType(fromFoo.foo),
            mergeMapTo([fromFoo.bar()]),
          )
        })

        constructor(private actions$: Actions) {}
      }
    `,
    `
      ${setup}
      @Injectable()
      class Effect {
        foo$ = createEffect(() => {
          return this.actions.pipe(
            ofType(foo),
            mapTo(bar()),
          )
        }, { dispatch: true })

        constructor(private actions: Actions) {}
      }
    `,
    ...(
      [
        '{ dispatch }',
        '{ dispatch: dispatch }',
        '{ dispatch: false, useEffectsErrorHandler: false }',
        '{ "dispatch": false }',
        '{ ["dispatch"]: false }',
        '{ [`dispatch`]: false }',
        '{ [dispatchKey]: false }',
        '{ ...configDispatchTrue, dispatch: false }',
        'getEffectConfig()',
        'shouldDispatch ? { dispatch: true } : { dispatch }',
        'dispatchNullable ?? { dispatch: false }',
      ] as const
    ).map(
      (effectConfig) =>
        `
          ${setup}
          @Injectable()
          class Effect {
            foo$ = createEffect(
              () => {
                return this.actions$.pipe(
                  ofType(foo),
                  tap(() => alert('hi')),
                )
              },
              ${effectConfig},
            )

            constructor(private actions$: Actions) {}
          }
        `,
    ),
    `
      ${setup}
      @Injectable()
      class Effect {
        foo$: Observable<unknown>

        constructor(actions$: Actions) {
          this.foo$ = createEffect(() =>
            actions$.pipe(
              ofType(genericFoo),
              map(() => genericBar()),
            ),
          )
        }
      }
    `,
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/223
    `
      ${setup}
      enum OrderEntityActionTypes {
        postPortInData = '[Order Entity] Post PortIn Data',
        postPortInDataSuccess = '[Order Entity] Post PortIn Data Success',
      }

      class PostPortInData implements Action {
        readonly type = OrderEntityActionTypes.postPortInData
      }

      class PostPortInDataSuccess implements Action {
        readonly type = OrderEntityActionTypes.postPortInDataSuccess
      }

      @Injectable()
      class Effect {
        readonly postPortInData$ = createEffect(() =>
          this.actions$.pipe(
            ofType<PostPortInData>(OrderEntityActionTypes.postPortInData),
            switchMap(() => of(new PostPortInDataSuccess())),
          ),
        )

        constructor(private readonly actions$: Actions) {}
      }
    `,
  ],
  invalid: [
    fromFixture(stripIndent`
      ${setup}
      @Injectable()
      class Effect {
        foo$ = createEffect(() =>
          this.actions$.pipe(
          ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType(foo),
            tap(() => alert('hi'))
          ),
        )

        constructor(private actions$: Actions) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      @Injectable()
      class Effect {
        foo$ = createEffect(() => {
          return this.actions$.pipe(
                 ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType(foo),
            tap(() => alert('hi'))
          )
        }, dispatchAny)

        constructor(private actions$: Actions) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      @Injectable()
      class Effect {
        foo$ = createEffect(() => {
          return this.actions$.pipe(
                 ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType(foo),
            tap(() => alert('hi'))
          )
        }, EMPTY_OBJECT)
        bar$ = createEffect(() =>
          this.actions$.pipe(
            ofType(genericFoo),
            map(() => genericBar()),
          ),
        )

        constructor(private actions$: Actions) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      @Injectable()
      class Effect {
        foo$ = createEffect(() => {
          return shouldDispatch
            ? this.actions$.pipe(
              ~~~~~~~~~~~~~~~~~~ [${messageId}]
                ofType(fromFoo.foo),
                tap(() => console.log('hello')),
              )
            : this.actions$.pipe(
              ~~~~~~~~~~~~~~~~~~ [${messageId}]
                ofType(fromFoo.foo),
                switchMap(() => [foo(), bar()]),
              )
        })

        constructor(private actions$: Actions) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      @Injectable()
      class Effect {
        foo$ = createEffect(() => {
          return ({ debounce = 100 } = {}) => {
            return (
              debounce
                ? this.actions$.pipe(
                  ~~~~~~~~~~~~~~~~~~ [${messageId}]
                    ofType(fromFoo.foo),
                    tap(() => alert('hi')),
                  )
                : this.actions$.pipe(),
              UNDEFINED
            )
          }
        })

        constructor(private actions$: Actions) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      @Injectable()
      class Effect {
        foo$: CreateEffectMetadata

        constructor(private actions$: Actions) {
          this.foo$ = createEffect(() =>
            this.actions$.pipe(
            ~~~~~~~~~~~~~~~~~~ [${messageId}]
              ofType(genericFoo),
              mergeMapTo(of(genericFoo()))
            ),
            configDispatchTrue
          )
        }
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      @Injectable()
      class Effect {
        readonly bar$ = createEffect(() =>
          this.actions$.pipe(
            ofType(genericFoo),
            map(() => genericBar()),
          ),
        )
        readonly foo$ = createEffect(
          () =>
            this.actions$.pipe(
            ~~~~~~~~~~~~~~~~~~ [${messageId}]
              ofType(genericFoo, genericBar),
              tap((action) => console.log(action))
            ),
            { ...configDispatchTrue }
        )

        constructor(private readonly actions$: Actions) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      @Injectable()
      class Effect {
        foo$: CreateEffectMetadata

        constructor(customActions$: Actions) {
          this.foo$ = createEffect(() =>
            customActions$.pipe(
            ~~~~~~~~~~~~~~~~~~~ [${messageId}]
              ofType(genericFoo),
              switchMapTo([genericBar(), genericFoo()]),
            ),
            { useEffectsErrorHandler: true }
          )
        }
      }
    `),
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/223
    fromFixture(stripIndent`
      ${setup}
      enum OrderEntityActionTypes {
        postPortInData = '[Order Entity] Post PortIn Data',
        postPortInDataSuccess = '[Order Entity] Post PortIn Data Success',
      }

      class PostPortInData implements Action {
        readonly type = OrderEntityActionTypes.postPortInData
      }

      class PostPortInDataSuccess implements Action {
        readonly type = OrderEntityActionTypes.postPortInDataSuccess
      }

      @Injectable()
      class Effect {
        readonly postPortInData$ = createEffect(() =>
          this.actions$.pipe(
          ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType<PostPortInData>(OrderEntityActionTypes.postPortInData),
            switchMap(() => of(new PostPortInData())),
          ),
        )

        constructor(private readonly actions$: Actions) {}
      }
    `),
  ],
})
