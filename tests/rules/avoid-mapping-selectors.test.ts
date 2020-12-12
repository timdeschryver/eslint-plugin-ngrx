import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/avoid-mapping-selectors'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `vm$ = this.store.select(selectItems)`,
    `vm$ = this.store.select(selectItems).pipe(filter(x => !!x))`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        vm$ = this.store.select(selectItems).pipe(map(x => ({name: x.name})))
                                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
      `,
    ),
    fromFixture(
      stripIndent`
        vm$ = this.store.select(selectItems).pipe(filter(x => !!x), map(x => ({name: x.name})))
                                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
      `,
    ),
  ],
})
