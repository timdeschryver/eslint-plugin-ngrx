import { stripIndent } from 'common-tags'
import path from 'path'
import rule, {
  messageId,
  messageIdSuggest,
} from '../../src/rules/effects/prefer-concat-latest-from'
import { NGRX_MODULE_PATHS } from '../../src/utils'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      import { of } from 'rxjs';
      export class Effect {
        effect$ = createEffect(
          () =>
            this.actions$.pipe(
              ofType(CollectionApiActions.addBookSuccess),
              concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
              switchMap(([action, bookCollection]) => {
                return of({type:'noop'})
              })
            ),
        );
      }`,
    `
      import { of } from 'rxjs';
      class Effect {
        detail$ = createEffect(() => {
          return this.actions.pipe(
            ofType(ProductDetailPage.loaded),
            concatMap((action) =>
              of(action).pipe(withLatestFrom(this.store.select(selectProducts))),
            ),
            mergeMap(([action, products]) => {
            })
          )
        })
      }`,
  ],
  invalid: [
    {
      code: stripIndent`
        import { of } from 'rxjs';
        export class Effect {
          effect$ = createEffect(
            () =>
              this.actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                withLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
                switchMap(([action, bookCollection]) => {
                  return of({type:'noop'})
                }),
              ),
          );
        }`,
      errors: [
        {
          messageId: messageId,
          suggestions: [
            {
              messageId: messageIdSuggest,
              output: stripIndent`
              import { concatLatestFrom } from '@ngrx/effects';
              import { of } from 'rxjs';
              export class Effect {
                effect$ = createEffect(
                  () =>
                    this.actions$.pipe(
                      ofType(CollectionApiActions.addBookSuccess),
                      concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
                      switchMap(([action, bookCollection]) => {
                        return of({type:'noop'})
                      }),
                    ),
                );
              }`,
            },
          ],
        },
      ],
    },
    {
      code: stripIndent`
        import { of } from 'rxjs';
        import type { OnRunEffects } from '@ngrx/effects'
        export class Effect {
          effect$ = createEffect(
            () =>
              this.actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                withLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
                switchMap(([action, bookCollection]) => {
                  return of({type:'noop'})
                }),
              ),
          );
        }`,
      errors: [
        {
          messageId: messageId,
          suggestions: [
            {
              messageId: messageIdSuggest,
              output: stripIndent`
              import { concatLatestFrom } from '@ngrx/effects';
              import { of } from 'rxjs';
              import type { OnRunEffects } from '@ngrx/effects'
              export class Effect {
                effect$ = createEffect(
                  () =>
                    this.actions$.pipe(
                      ofType(CollectionApiActions.addBookSuccess),
                      concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
                      switchMap(([action, bookCollection]) => {
                        return of({type:'noop'})
                      }),
                    ),
                );
              }`,
            },
          ],
        },
      ],
    },
  ],
})

ruleTester({ ngrxModule: NGRX_MODULE_PATHS.effects, version: '^11.0.0' }).run(
  path.parse(__filename).name,
  rule,
  {
    valid: [
      `
      import { of } from 'rxjs';
      export class Effect {
        effect$ = createEffect(
          () =>
            this.actions$.pipe(
              ofType(CollectionApiActions.addBookSuccess),
              withLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
              switchMap(([action, bookCollection]) => {
                return of({type:'noop'})
              }),
            ),
        );
      }`,
    ],
    invalid: [],
  },
)
