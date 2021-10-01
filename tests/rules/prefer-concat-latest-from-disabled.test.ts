import path from 'path'
import rule from '../../src/rules/effects/prefer-concat-latest-from'
import { clearCache, MODULE_PATHS, setNgrxVersion } from '../../src/utils'
import { ruleTester } from '../utils'

setNgrxVersion(MODULE_PATHS.effects, '11.0.0')

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
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
  ],
  invalid: [],
})

clearCache()
