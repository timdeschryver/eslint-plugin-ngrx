import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/store/avoid-combining-selectors'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
      import { Store } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        vm$ = this.store.select(selectItems)
        constructor(private store: Store){}
      }
    `,
    `
      import { Store, select } from '@ngrx/store'
      @Component()
      export class FixtureComponent {
        vm$ = this.store.pipe(select(selectItems))
        constructor(private store: Store){}
      }
    `,
    `
    import { Store } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      vm$ = combineLatest(this.store.select(selectItems), this.somethingElse())
      constructor(private store: Store){}
    }
    `,
    `
    import { Store } from '@ngrx/store'
    @Component()
    export class FixtureComponent {
      vm$ = combineLatest(this.somethingElse(), this.store.select(selectItems))
      constructor(private store: Store){}
    }
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = combineLatest(this.store.select(selectItems), this.store.select(selectOtherItems))
                                                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private store: Store){}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = combineLatest(this.store.pipe(select(selectItems)), this.store.pipe(select(selectOtherItems)))
                                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private store: Store){}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = combineLatest(this.customName.select(selectItems), this.customName.select(selectOtherItems), this.somethingElse())
                                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private customName: Store){}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = combineLatest(this.customName.select(selectItems), this.customName.pipe(select(selectOtherItems)), this.somethingElse())
                                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private customName: Store){}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = combineLatest(this.store.pipe(select(selectItems)), this.store.select(selectOtherItems))
                                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private store: Store){}
        }
      `,
    ),

    fromFixture(
      stripIndent`
        import { Store } from '@ngrx/store'
        @Component()
        export class FixtureComponent {
          vm$ = combineLatest(this.store.select(selectItems), this.store.pipe(select(selectOtherItems)))
                                                              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private store: Store){}
        }
      `,
    ),
  ],
})
