import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/effects/no-multiple-actions-in-effects'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      @Injectable()
      export class Effects {
        effectOK$ = createEffect(() =>
          this.actions$.pipe(map(() => foo()))
        )
      }`,
    `
      @Injectable()
      export class Effects {
        effectOK1$ = createEffect(() =>
          this.actions$.pipe(switchMap(() => {
            return of(foo())
          }))
        )
      }`,
    `
      const action = () => foo()
      @Injectable()
      export class Effects {
        effectOK2$ = createEffect(() =>
          this.actions$.pipe(mapTo(action()))
        )
      }`,
    // This specific test ensures that we only care about built-in `rxjs` operators.
    `
      @Injectable()
      export class Effects {
        effectOK3$ = createEffect(() =>
          this.actions$.pipe(
            aconcatMapTo([foo()]),
            switchMapTop([bar()]),
          )
        )
      }`,
    `
      @Injectable()
      export class Effects {
        effectOK4$ = createEffect(() =>
          this.actions$.pipe(
            exhaustMap(() => {
              return of({}).pipe(
                map(response => foo()),
                catchError(() => of(bar()))
              );
            })
          )
        )
      }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        @Injectable()
        export class Effects {
          effectNOK$ = createEffect(() =>
            this.actions$.pipe(flatMap(_ => [foo(), bar()])),
                                            ~~~~~~~~~~~~~~  [${messageId}]
          )
      }`,
    ),
    fromFixture(
      stripIndent`
        @Injectable()
        export class Effects {
          effectNOK1$ = createEffect(() =>
            this.actions$.pipe(mergeMap(_ => { return [foo(), bar()] }))
                                                      ~~~~~~~~~~~~~~  [${messageId}]
          )
        }`,
    ),
    fromFixture(
      stripIndent`
        @Injectable()
        export class Effects {
          effectNOK2$ = createEffect(() =>
            this.actions$.pipe(exhaustMap(function() { return [foo(), bar()] }))
                                                              ~~~~~~~~~~~~~~  [${messageId}]
          )
        }`,
    ),
    fromFixture(
      stripIndent`
        import { of } from 'rxjs'
        @Injectable()
        export class Effects {
          readonly effectNOK3$ = createEffect(() =>
            this.actions$.pipe(concatMapTo(condition ? [foo(), bar()] : of(foo())))
                                           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  [${messageId}]
          )
        }`,
    ),
    fromFixture(
      stripIndent`
        const actions = [foo(), bar()]
        @Injectable()
        export class Effects {
          readonly effectNOK4$ = createEffect(() =>
            this.actions$.pipe(concatMapTo(actions))
                                           ~~~~~~~  [${messageId}]
          )
        }`,
    ),
    fromFixture(
      stripIndent`
        const actions = () => [foo(), bar()]
        @Injectable()
          export class Effects {
          effectNOK5$ = createEffect(() =>
            this.actions$.pipe(
              exhaustMap(() => {
                return of({}).pipe(
                  switchMap(() => actions()),
                                  ~~~~~~~~~  [${messageId}]
                  catchError(() => of(bar()))
                );
              })
            )
          )
        }`,
    ),
    fromFixture(
      stripIndent`
        import { Action } from '@ngrx/store'
        @Injectable()
        export class Effects {
          effectNOK6$ = createEffect(() =>
            this.actions$.pipe(concatMap(() => {
              let actions: Action[] = [];
              return actions;
                     ~~~~~~~  [${messageId}]
            }))
          )
        }`,
    ),
    fromFixture(
      stripIndent`
        import { Action } from '@ngrx/store'
        import { of } from 'rxjs'
        @Injectable()
        export class Effects {
          effectNOK7$ = createEffect(() => ({ debounce = 300 } = {}) =>
            this.actions$.pipe(switchMap(() => {
              let actions: Action[] | null;
              return actions ?? of(foo());
                     ~~~~~~~~~~~~~~~~~~~~  [${messageId}]
            }))
          )
        }`,
    ),
  ],
})
