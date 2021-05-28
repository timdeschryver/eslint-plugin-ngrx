import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, { messageId } from '../../src/rules/effects/avoid-cyclic-effects'
import { ruleTester } from '../utils'

const setup = `
  import { Actions, createEffect, ofType } from '@ngrx/effects';
  import { createAction } from '@ngrx/store';
  import { map, tap } from 'rxjs/operators'

  const foo = createAction('FOO');
  const bar = createAction('BAR');

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
    fromFixture(stripIndent`
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
    `),
    fromFixture(stripIndent`
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
    `),
    fromFixture(stripIndent`
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
    `),
    fromFixture(stripIndent`
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
    `),
    fromFixture(stripIndent`
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
    `),
    fromFixture(stripIndent`
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
    `),
    // TODO: this needs to be invalid
    fromFixture(stripIndent`
      ${setup}
      class Effect {
        foo$ = createEffect(() =>
          this.actions$.pipe(
            ofType(genericFoo),
          ),
        )

        constructor(
          private actions$: Actions,
        ) {}
      }
    `),
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
  ],
})
