import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/effects/avoid-cyclic-effects'
import { ruleTester } from '../utils'

const setup = `
  import type { OnRunEffects } from '@ngrx/effects'
  import { EffectConfig } from '@ngrx/effects'
  import { Actions, createEffect, ofType } from '@ngrx/effects'
  import { createAction } from '@ngrx/store'
  import { map, tap } from 'rxjs/operators'

  const foo = createAction('FOO')
  const bar = createAction('BAR')

  const fromFoo = {
    foo,
    bar
  }
`.concat(
  [
    "const subject = 'SUBJECT'",
    'const genericFoo = createAction(`${subject} FOO`);',
    'const genericBar = createAction(`${subject} BAR`);',
  ].join('\n'),
)

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      ${setup}
      class Effect {
        foo$ = createEffect(() =>
          this.actions$.pipe(
            ofType(foo),
            map(() => bar()),
          ),
        )

        constructor(
          private actions$: Actions,
        ) {}
      }
    `,
    `
      ${setup}
      class Effect {
        foo$ = createEffect(() => {
          return this.actions$.pipe(
            ofType(foo),
            map(() => bar()),
          )
        })

        constructor(
          private actions$: Actions,
        ) {}
      }
    `,
    `
      ${setup}
      class Effect {
        foo$ = createEffect(() => {
          return this.actions$.pipe(
            ofType(fromFoo.foo),
            map(() => fromFoo.bar()),
          )
        })

        constructor(
          private actions$: Actions,
        ) {}
      }
    `,
    `
      ${setup}
      class Effect {
        foo$ = createEffect(() => {
          return this.actions.pipe(
            ofType(foo),
            mapTo(bar()),
          )
        })

        constructor(
          private actions: Actions,
        ) {}
      }
    `,
    `
      ${setup}
      class Effect {
        foo$ = createEffect(() => {
          return this.actions$.pipe(
            ofType(foo),
            tap(() => alert('hi'))
          )
          }, { dispatch: false }
        )

        constructor(
          private actions$: Actions,
        ) {}
      }
    `,
    `
      ${setup}
      class Effect {
        foo$ = createEffect(() =>
          this.actions$.pipe(
            ofType(genericFoo),
            map(() => genericBar()),
          ),
        )

        constructor(
          private actions$: Actions,
        ) {}
      }
    `,
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/223
    `
      import { Injectable } from '@angular/core';
      import { Actions, createEffect, concatLatestFrom, ofType } from '@ngrx/effects';
      import { Action } from '@ngrx/store';
      import { of } from 'rxjs';
      import { catchError, map, switchMap } from 'rxjs/operators';

      enum OrderEntityActionTypes {
        postPortInData = '[Order Entity] Post PortIn Data',
        postPortInDataSuccess = '[Order Entity] Post PortIn Data Success',
        postPartnerData = '[Order Entity] Post provider Data',
      }

      type OrderContext = { id: string }
      type OrderEntity = { id: string }
      type PartnerData = { name: string }

      class PostPortInData implements Action {
        public readonly type: OrderEntityActionTypes =
          OrderEntityActionTypes.postPortInData

        constructor(public payload: OrderContext) {}
      }

      class PostPortInDataSuccess implements Action {
        public readonly type: OrderEntityActionTypes =
          OrderEntityActionTypes.postPortInDataSuccess
      }

      class PostPartnerData implements Action {
        public readonly type: OrderEntityActionTypes =
          OrderEntityActionTypes.postPartnerData

        constructor(public payload: PartnerData) {}
      }

      type OrderEntityActions =
        | PostPortInData
        | PostPortInDataSuccess
        | PostPartnerData

      @Injectable()
      class OrderEntityService {
        queueContextCall(orderContext: OrderContext, orderEntity: OrderEntity) {
          return of()
        }
      }

      @Injectable()
      class AppStoreFacadeService {
        readonly order = { orderEntity$: of({}) }
      }

      @Injectable()
      class Effect {
        public postPortInData$ = createEffect(() =>
          this.actions$.pipe(
            ofType<PostPortInData>(OrderEntityActionTypes.postPortInData),
            map((action) => action.payload),
            concatLatestFrom(() => this.appStoreFacadeService.order.orderEntity$),
            switchMap(([orderContext, orderEntity]) =>
              this.orderEntityService
                .queueContextCall(orderContext, orderEntity)
                .pipe(
                  map(() => new PostPortInDataSuccess()),
                ),
            ),
          ),
        )

        constructor(
          private readonly actions$: Actions,
          private readonly appStoreFacadeService: AppStoreFacadeService,
          private readonly orderEntityService: OrderEntityService,
        ) {}
      }
    `,
  ],
  invalid: [
    fromFixture(stripIndent`
      ${setup}
      class Effect {
        foo$ = createEffect(() =>
          this.actions$.pipe(
          ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType(foo),
            tap(() => alert('hi'))
          ),
        )

        constructor(
          private actions$: Actions,
        ) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      class Effect {
        foo$ = createEffect(() => {
          return this.actions$.pipe(
                 ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType(foo),
            tap(() => alert('hi'))
          )
        })

        constructor(
          private actions$: Actions,
        ) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      class Effect {
        foo$ = createEffect(() => {
          return this.actions$.pipe(
                 ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType(foo),
            tap(() => alert('hi'))
          )
        }, { dispatch: true })

        constructor(
          private actions$: Actions,
        ) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      class Effect {
        foo$ = createEffect(() =>
          this.actions$.pipe(
          ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType(fromFoo.foo),
            tap(() => alert('hi'))
          ),
        )

        constructor(
          private actions$: Actions,
        ) {}
      }
    `),
    fromFixture(stripIndent`
      ${setup}
      class Effect {
        foo$ = createEffect(() =>
          this.actions$.pipe(
          ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType(genericFoo),
          ),
        )

        constructor(
          private actions$: Actions,
        ) {}
      }
    `),
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/223
    fromFixture(stripIndent`
      import { Injectable } from '@angular/core';
      import { Actions, createEffect, concatLatestFrom, ofType } from '@ngrx/effects';
      import { Action } from '@ngrx/store';
      import { of } from 'rxjs';
      import { catchError, map, switchMap } from 'rxjs/operators';

      enum OrderEntityActionTypes {
        postPortInData = '[Order Entity] Post PortIn Data',
        postPortInDataSuccess = '[Order Entity] Post PortIn Data Success',
        postPartnerData = '[Order Entity] Post provider Data',
      }

      type OrderContext = { id: string }
      type OrderEntity = { id: string }
      type PartnerData = { name: string }

      class PostPortInData implements Action {
        public readonly type: OrderEntityActionTypes =
          OrderEntityActionTypes.postPortInData

        constructor(public payload: OrderContext) {}
      }

      class PostPortInDataSuccess implements Action {
        public readonly type: OrderEntityActionTypes =
          OrderEntityActionTypes.postPortInDataSuccess
      }

      class PostPartnerData implements Action {
        public readonly type: OrderEntityActionTypes =
          OrderEntityActionTypes.postPartnerData

        constructor(public payload: PartnerData) {}
      }

      type OrderEntityActions =
        | PostPortInData
        | PostPortInDataSuccess
        | PostPartnerData

      @Injectable()
      class OrderEntityService {
        queueContextCall(orderContext: OrderContext, orderEntity: OrderEntity) {
          return of()
        }
      }

      @Injectable()
      class AppStoreFacadeService {
        readonly order = { orderEntity$: of({}) }
      }

      @Injectable()
      class Effect {
        public postPortInData$ = createEffect(() =>
          this.actions$.pipe(
          ~~~~~~~~~~~~~~~~~~ [${messageId}]
            ofType<PostPortInData>(OrderEntityActionTypes.postPortInData),
            map((action) => action.payload),
            concatLatestFrom(() => this.appStoreFacadeService.order.orderEntity$),
            switchMap(([orderContext, orderEntity]) =>
              this.orderEntityService
                .queueContextCall(orderContext, orderEntity)
                .pipe(
                  map(() => new PostPortInDataSuccess()),
                  catchError(() => of(new PostPortInData())),
                ),
            ),
          ),
        )

        constructor(
          private readonly actions$: Actions,
          private readonly appStoreFacadeService: AppStoreFacadeService,
          private readonly orderEntityService: OrderEntityService,
        ) {}
      }
    `),
  ],
})
