import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/store/prefer-action-creator-in-dispatch'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    @Component()
    class Test {
      readonly viewModel$ = somethingElse()

      constructor(private readonly appFacade: AppFacade) {}
    }`,
    `
    import { Store } from '@ngrx/store';
    @Directive()
    class Test {
      constructor(store$: Store) {
        store$.dispatch(action)
      }
    }`,
    `
    import { Store } from '@ngrx/store';
    @Component()
    class Test {
      constructor(private readonly store$: Store) {
        this.store$.dispatch(BookActions.load())
      }
    }`,
    // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/255
    `
    import { Store } from '@ngrx/store';
    @Component()
    class Test {
      constructor(private readonly store: Store) {
        this.store.dispatch(login({ payload }));
        this.store.dispatch(AuthActions.dispatch({ type: 'SUCCESS' }));
        nonStore.dispatch(AuthActions.dispatch({ type: 'FAIL' }));
      }
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store';
      @Component()
      class Test {
        constructor(store$: Store) {
          store$.dispatch(new CustomAction())
                          ~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      }`,
    ),
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store';
      @Injectable()
      class Test {
        constructor(private readonly store$: Store) {
          this.store$.dispatch({ type: 'custom' })
                               ~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      }`,
    ),
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store';
      @Injectable()
      class Test {
        constructor(private readonly store$: Store) {
          this.store$.dispatch(new Login({ payload }));
                               ~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          this.store$.dispatch(new AuthActions.dispatch({ type: 'SUCCESS' }));
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          nonStore.dispatch(new AuthActions.dispatch({ type: 'FAIL' }));
        }
      }`,
    ),
    fromFixture(
      stripIndent`
      import { Store } from '@ngrx/store';
      @Component()
      class Test {
        constructor(private readonly store$: Store) {}

        ngOnInit() {
          this.store$.dispatch(useObject ? { type: 'custom' } : new CustomAction())
                                           ~~~~~~~~~~~~~~~~~~ [${messageId}]
                                                                ~~~~~~~~~~~~~~~~~~ [${messageId}]
        }
      }`,
    ),
  ],
})
