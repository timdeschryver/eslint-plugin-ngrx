import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/effects/prefer-concat-latest-from'
import { NGRX_MODULE_PATHS } from '../../src/utils'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    {
      code: `
      import { of, withLatestFrom } from 'rxjs'
      class Test {
        effectOK = createEffect(
          () =>
            this.actions$.pipe(
              ofType(CollectionApiActions.addBookSuccess),
              concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
              switchMap(([, bookCollection]) => {
                return of({ type: 'noop' })
              })
            ),
        );
      }`,
      options: [{ strict: true }],
    },
    `
    import { of, withLatestFrom } from 'rxjs'
    class Test {
      effectOK1 = createEffect(() => {
        return this.actions.pipe(
          ofType(ProductDetailPage.loaded),
          concatMap((action) =>
            of(action).pipe(withLatestFrom(this.store.select(selectProducts))),
          ),
          mergeMapTo(of({ type: 'noop' })),
        )
      })
    }`,
    `
    import { of, withLatestFrom } from 'rxjs'
    class Test {
      effectOK2 = createEffect(() => {
        return this.actions.pipe(
          ofType(ProductDetailPage.loaded),
          concatMap((action) =>
            of(action).pipe(
              withLatestFrom(this.store.select$(something), (one, other) => somethingElse())
            ),
          ),
          mergeMap(([action, products]) => {
            return of(products)
          }),
        )
      })
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      import { of, withLatestFrom } from 'rxjs'
      class Test {
        effectNOK = createEffect(() =>
          this.actions$.pipe(
            ofType(CollectionApiActions.addBookSuccess),
            withLatestFrom((action) =>
            ~~~~~~~~~~~~~~ [${messageId}]
              this.store.select(fromBooks.selectCollectionBookIds),
            ),
            switchMap(([action, bookCollection]) => {
              return of({ type: 'noop' })
            }),
          ),
        )
      }`,
      {
        output: stripIndent`
        import { concatLatestFrom } from '@ngrx/effects';
        import { of, withLatestFrom } from 'rxjs'
        class Test {
          effectNOK = createEffect(() =>
            this.actions$.pipe(
              ofType(CollectionApiActions.addBookSuccess),
              concatLatestFrom((action) =>
                this.store.select(fromBooks.selectCollectionBookIds),
              ),
              switchMap(([action, bookCollection]) => {
                return of({ type: 'noop' })
              }),
            ),
          )
        }`,
      },
    ),
    fromFixture(
      stripIndent`
      import { of, withLatestFrom } from 'rxjs'
      class Test {
        effectNOK1 = createEffect(() => {
          return this.actions.pipe(
            ofType(ProductDetailPage.loaded),
            concatMap((action) =>
              of(action).pipe(withLatestFrom(this.store.select(selectProducts))),
                              ~~~~~~~~~~~~~~ [${messageId}]
            ),
            mergeMapTo(of({ type: 'noop' })),
          )
        })
      }`,
      {
        options: [{ strict: true }],
        output: stripIndent`
        import { concatLatestFrom } from '@ngrx/effects';
        import { of, withLatestFrom } from 'rxjs'
        class Test {
          effectNOK1 = createEffect(() => {
            return this.actions.pipe(
              ofType(ProductDetailPage.loaded),
              concatMap((action) =>
                of(action).pipe(concatLatestFrom(() => this.store.select(selectProducts))),
              ),
              mergeMapTo(of({ type: 'noop' })),
            )
          })
        }`,
      },
    ),
    fromFixture(
      stripIndent`
      import { of, withLatestFrom } from 'rxjs'
      class Test {
        effectNOK2 = createEffect(() => {
          return this.actions.pipe(
            ofType(ProductDetailPage.loaded),
            concatMap((action) =>
              of(action).pipe(
                withLatestFrom(this.store.select$(something), (one, other) => somethingElse())
                ~~~~~~~~~~~~~~ [${messageId}]
              ),
            ),
            mergeMap(([action, products]) => {
              return of(products)
            }),
          )
        })
      }`,
      {
        options: [{ strict: true }],
        output: stripIndent`
        import { concatLatestFrom } from '@ngrx/effects';
        import { of, withLatestFrom, map } from 'rxjs'
        class Test {
          effectNOK2 = createEffect(() => {
            return this.actions.pipe(
              ofType(ProductDetailPage.loaded),
              concatMap((action) =>
                of(action).pipe(
                  concatLatestFrom(() => this.store.select$(something),), map( (one, other) => somethingElse())
                ),
              ),
              mergeMap(([action, products]) => {
                return of(products)
              }),
            )
          })
        }`,
      },
    ),
  ],
})

ruleTester({ ngrxModule: NGRX_MODULE_PATHS.effects, version: '^11.0.0' }).run(
  path.parse(__filename).name,
  rule,
  {
    valid: [
      `
      import { of } from 'rxjs';
      class Test {
        effectOK = createEffect(
          () =>
            this.actions$.pipe(
              ofType(CollectionApiActions.addBookSuccess),
              withLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
              switchMap(([action, bookCollection]) => {
                return of({ type: 'noop' })
              }),
            ),
        );
      }`,
    ],
    invalid: [],
  },
)
