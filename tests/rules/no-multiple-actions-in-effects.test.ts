import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/no-multiple-actions-in-effects'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    {
      code: `
        export class Effects {
          seven$ = createEffect(() =>
            this.actions$.pipe(map(() => foo()))
          )
        }`,
      parserOptions: {
        project: './tsconfig.tests.eslint.json',
      },
      filename: 'test.ts',
    },
    {
      code: `
        export class Effects {
          five$ = createEffect(() =>
            this.actions$.pipe(switchMap(() => {
              return of(foo())
            }))
          )
        }`,
      parserOptions: {
        project: './tsconfig.tests.eslint.json',
      },
      filename: 'test.ts',
    },
    {
      code: `
        export class Effects {
          six$ = createEffect(() =>
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
      parserOptions: {
        project: './tsconfig.tests.eslint.json',
      },
      filename: 'test.ts',
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        export class Effects {
          one$ = createEffect(() =>
            this.actions$.pipe(switchMap(_ => [foo(), bar()])),
                                              ~~~~~~~~~~~~~~  [${messageId}]
          )
      }`,
      {
        parserOptions: {
          project: './tsconfig.tests.eslint.json',
        },
        filename: 'test.ts',
      },
    ),
    fromFixture(
      stripIndent`
        export class Effects {
          two$ = createEffect(() =>
            this.actions$.pipe(mergeMap(_ => { return [foo(), bar()] }))
                                                      ~~~~~~~~~~~~~~  [${messageId}]
          )
        }`,
      {
        parserOptions: {
          project: './tsconfig.tests.eslint.json',
        },
        filename: 'test.ts',
      },
    ),
    fromFixture(
      stripIndent`
        export class Effects {
          three$ = createEffect(() =>
            this.actions$.pipe(exhaustMap(function() { return [foo(), bar()] }))
                                                              ~~~~~~~~~~~~~~  [${messageId}]
            )
        }`,
      {
        parserOptions: {
          project: './tsconfig.tests.eslint.json',
        },
        filename: 'test.ts',
      },
    ),
    fromFixture(
      stripIndent`
        export class Effects {
          eight$ = createEffect(() =>
            this.actions$.pipe(
              exhaustMap(() => {
                return of({}).pipe(
                  switchMap(() => [foo(), bar()]),
                                  ~~~~~~~~~~~~~~  [${messageId}]
                  catchError(() => of(bar()))
                );
              })
            )
          )
        }`,
      {
        parserOptions: {
          project: './tsconfig.tests.eslint.json',
        },
        filename: 'test.ts',
      },
    ),
    fromFixture(
      stripIndent`
        export class Effects {
          four$ = createEffect(() =>
            this.actions$.pipe(concatMap(() => {
              let actions: Action[] = [];
              return actions;
                     ~~~~~~~  [${messageId}]
            }))
          )
        }`,
      {
        parserOptions: {
          project: './tsconfig.tests.eslint.json',
        },
        filename: 'test.ts',
      },
    ),
  ],
})
