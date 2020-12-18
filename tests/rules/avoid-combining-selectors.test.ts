import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/avoid-combining-selectors'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `vm$ = this.store.select(selectItems)`,
    `vm$ = combineLatest(this.store.select(selectItems), this.somethingElse())`,
    `vm$ = combineLatest(this.somethingElse(), this.store.select(selectItems))`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        vm$ = combineLatest(this.store.select(selectItems), this.store.select(selectOtherItems))
                                                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
      `,
    ),
    fromFixture(
      stripIndent`
        vm$ = combineLatest(this.store.select(selectItems), this.store.select(selectOtherItems), this.somethingElse())
                                                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
      `,
    ),
  ],
})
