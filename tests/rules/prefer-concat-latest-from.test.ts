import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/effects/prefer-concat-latest-from'
import { NGRX_MODULE_PATHS } from '../../src/utils'
import { ruleTester } from '../utils'

ruleTester({ ngrxModule: NGRX_MODULE_PATHS.effects, version: '12.1.0' }).run(
  path.parse(__filename).name,
  rule,
  {
    valid: [
      {
        code: `
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
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

  constructor(private readonly actions$: Actions) {}
}`,
        options: [{ strict: true }],
      },
      `
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
class Test {
readonly effectOK1: CreateEffectMetadata

constructor(actions$: Actions) {
  this.effectOK1 = createEffect(() => ({ scheduler = asyncScheduler } = {}) => {
    return actions$.pipe(
      ofType(ProductDetailPage.loaded),
      concatMap((action) =>
        of(action).pipe(withLatestFrom(this.store.select(selectProducts))),
      ),
      mergeMapTo(of({ type: 'noop' })),
    )
  }, { dispatch: false })
}
}`,
      `
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
export class Test {
effectOK2 = createEffect(() =>
  condition
    ? this.actions$.pipe(
        ofType(ProductDetailPage.loaded),
        concatMap((action) =>
          of(action).pipe(
            withLatestFrom(this.store.select$(something), (one, other) =>
              somethingElse(),
            ),
          ),
        ),
        mergeMap(([action, products]) => of(products)),
      )
    : this.actions$.pipe(),
)

constructor(private readonly actions$: Actions) {}
}`,
    ],
    invalid: [
      fromFixture(
        stripIndent`
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
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

  constructor(private readonly actions$: Actions) {}
}`,
        {
          output: stripIndent`
import { Actions, concatLatestFrom } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
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

  constructor(private readonly actions$: Actions) {}
}`,
        },
      ),
      fromFixture(
        stripIndent`
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
class Test {
  readonly effectNOK1: CreateEffectMetadata

  constructor(actions$: Actions) {
    this.effectNOK1 = createEffect(
      () =>
        ({ debounce = 300 } = {}) =>
          condition
            ? actions$.pipe()
            : actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                withLatestFrom(() => this.store.select(fromBooks.selectCollectionBookIds)),
                ~~~~~~~~~~~~~~ [${messageId}]
                switchMap(([action, bookCollection]) => {
                  return of({ type: 'noop' })
                }),
              ),
    )
  }
}`,
        {
          output: stripIndent`
import { Actions, concatLatestFrom } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
class Test {
  readonly effectNOK1: CreateEffectMetadata

  constructor(actions$: Actions) {
    this.effectNOK1 = createEffect(
      () =>
        ({ debounce = 300 } = {}) =>
          condition
            ? actions$.pipe()
            : actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                concatLatestFrom(() => this.store.select(fromBooks.selectCollectionBookIds)),
                switchMap(([action, bookCollection]) => {
                  return of({ type: 'noop' })
                }),
              ),
    )
  }
}`,
        },
      ),
      fromFixture(
        stripIndent`
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
class Test {
  effectNOK2 = createEffect(() => ({ debounce = 700 } = {}) => {
    return this.actions$.pipe(
      ofType(ProductDetailPage.loaded),
      concatMap((action) =>
        of(action).pipe(withLatestFrom(this.store.select(selectProducts))),
                        ~~~~~~~~~~~~~~ [${messageId}]
      ),
      mergeMapTo(of({ type: 'noop' })),
    )
  }, { dispatch: false })

  constructor(private readonly actions$: Actions) {}
}`,
        {
          options: [{ strict: true }],
          output: stripIndent`
import { Actions, concatLatestFrom } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
class Test {
  effectNOK2 = createEffect(() => ({ debounce = 700 } = {}) => {
    return this.actions$.pipe(
      ofType(ProductDetailPage.loaded),
      concatMap((action) =>
        of(action).pipe(concatLatestFrom(() => this.store.select(selectProducts))),
      ),
      mergeMapTo(of({ type: 'noop' })),
    )
  }, { dispatch: false })

  constructor(private readonly actions$: Actions) {}
}`,
        },
      ),
      fromFixture(
        stripIndent`
import { Actions, concatLatestFrom } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
@Injectable()
class Test {
  effectNOK3 = createEffect(() => {
    return condition
      ? this.actions$.pipe(
          ofType(ProductDetailPage.loaded),
          concatMap((action) =>
            of(action).pipe(
              withLatestFrom(this.store.select$(something), (one, other) => somethingElse()),
              ~~~~~~~~~~~~~~ [${messageId}]
            ),
          ),
          mergeMap(([action, products]) => of(products)),
        )
      : this.actions$.pipe()
  })

  constructor(private readonly actions$: Actions) {}
}`,
        {
          options: [{ strict: true }],
          output: stripIndent`
import { Actions, concatLatestFrom } from '@ngrx/effects'
import { of, withLatestFrom, map } from 'rxjs'
@Injectable()
class Test {
  effectNOK3 = createEffect(() => {
    return condition
      ? this.actions$.pipe(
          ofType(ProductDetailPage.loaded),
          concatMap((action) =>
            of(action).pipe(
              concatLatestFrom(() => this.store.select$(something),), map( (one, other) => somethingElse()),
            ),
          ),
          mergeMap(([action, products]) => of(products)),
        )
      : this.actions$.pipe()
  })

  constructor(private readonly actions$: Actions) {}
}`,
        },
      ),
    ],
  },
)

ruleTester({ ngrxModule: NGRX_MODULE_PATHS.effects, version: '^11.0.0' }).run(
  path.parse(__filename).name,
  rule,
  {
    valid: [
      `
import { of, withLatestFrom } from 'rxjs';
@Injectable()
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

  constructor(private readonly actions$: Actions) {}
}`,
    ],
    invalid: [],
  },
)
