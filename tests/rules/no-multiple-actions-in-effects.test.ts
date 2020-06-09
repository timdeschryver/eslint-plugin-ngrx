import { stripIndent } from 'common-tags'
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
        project: './tsconfig.eslint.json',
      },
      filename: 'fake.ts',
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
        project: './tsconfig.eslint.json',
      },
      filename: 'fake.ts',
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
        project: './tsconfig.eslint.json',
      },
      filename: 'fake.ts',
    },
  ],
  invalid: [
    {
      code: stripIndent`
export class Effects {
  one$ = createEffect(() =>
    this.actions$.pipe(switchMap(_ => [foo(), bar()])),
  )
}`,
      filename: 'fake.ts',
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      errors: [
        {
          messageId,
          line: 3,
          column: 39,
          endLine: 3,
          endColumn: 53,
        },
      ],
    },
    {
      code: stripIndent`
export class Effects {
  two$ = createEffect(() =>
    this.actions$.pipe(mergeMap(_ => { return [foo(), bar()] }))
  )
}`,
      filename: 'fake.ts',
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      errors: [
        {
          messageId,
          line: 3,
          column: 47,
          endLine: 3,
          endColumn: 61,
        },
      ],
    },
    {
      code: stripIndent`
export class Effects {
  three$ = createEffect(() =>
    this.actions$.pipe(exhaustMap(function() { return [foo(), bar()] }))
  )
}`,
      filename: 'fake.ts',
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      errors: [
        {
          messageId,
          line: 3,
          column: 55,
          endLine: 3,
          endColumn: 69,
        },
      ],
    },
    {
      code: stripIndent`
export class Effects {
  eight$ = createEffect(() =>
    this.actions$.pipe(
      exhaustMap(() => {
        return of({}).pipe(
          switchMap(() => [foo(), bar()]),
          catchError(() => of(bar()))
        );
      })
    )
  )
}`,
      filename: 'fake.ts',
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      errors: [
        {
          messageId,
          line: 6,
          column: 27,
          endLine: 6,
          endColumn: 41,
        },
      ],
    },
    {
      code: stripIndent`
export class Effects {
  four$ = createEffect(() =>
    this.actions$.pipe(concatMap(() => { let actions: Action[] = []; return actions; }))
  )
}`,
      filename: 'fake.ts',
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      errors: [
        {
          messageId,
          line: 3,
          column: 77,
          endLine: 3,
          endColumn: 84,
        },
      ],
    },
  ],
})
