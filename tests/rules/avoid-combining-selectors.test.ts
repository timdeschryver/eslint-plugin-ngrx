import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/avoid-combining-selectors'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
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
          vm$ = combineLatest(this.customName.select(selectItems), this.customName.select(selectOtherItems), this.somethingElse())
                                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
          constructor(private customName: Store){}
        }
      `,
    ),
  ],
})
