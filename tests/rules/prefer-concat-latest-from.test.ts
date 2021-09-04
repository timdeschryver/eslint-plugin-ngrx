import { stripIndent } from 'common-tags'
import path from 'path'
import type { MessageIds } from '../../src/rules/effects/prefer-concat-latest-from'
import rule, {
  messageId,
  messageIdSuggest,
} from '../../src/rules/effects/prefer-concat-latest-from'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      export class Effect {
        effect$ = createEffect(
          () =>
            this.actions$.pipe(
              ofType(CollectionApiActions.addBookSuccess),
              concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
              switchMap(([action, bookCollection]) => {
                return {}
              })
            ),
        );
      }`,
    `
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
        export class Effect {
          effect$ = createEffect(
            () =>
              this.actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                withLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
                switchMap(([action, bookCollection]) => {
                  return {}
                }),
              ),
          );
        }`,
      errors: [
        {
          messageId: messageId,
          suggestions: [
            {
              messageId: messageIdSuggest as MessageIds,
              output: stripIndent`
              import { concatLatestFrom } from '@ngrx/effects';
              export class Effect {
                effect$ = createEffect(
                  () =>
                    this.actions$.pipe(
                      ofType(CollectionApiActions.addBookSuccess),
                      concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
                      switchMap(([action, bookCollection]) => {
                        return {}
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
        import type { OnRunEffects } from '@ngrx/effects'
        export class Effect {
          effect$ = createEffect(
            () =>
              this.actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                withLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
                switchMap(([action, bookCollection]) => {
                  return {}
                }),
              ),
          );
        }`,
      errors: [
        {
          messageId: messageId,
          suggestions: [
            {
              messageId: messageIdSuggest as MessageIds,
              output: stripIndent`
              import { concatLatestFrom } from '@ngrx/effects';
              import type { OnRunEffects } from '@ngrx/effects'
              export class Effect {
                effect$ = createEffect(
                  () =>
                    this.actions$.pipe(
                      ofType(CollectionApiActions.addBookSuccess),
                      concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
                      switchMap(([action, bookCollection]) => {
                        return {}
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
