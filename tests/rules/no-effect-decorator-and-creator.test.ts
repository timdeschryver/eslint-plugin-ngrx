import { stripIndent } from 'common-tags'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/no-effect-decorator-and-creator'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    stripIndent`
      @Injectable()
      export class FixtureEffects {
        creator = createEffect(() => this.actions)

        constructor(private actions: Actions){}
      }`,
    stripIndent`
      @Injectable()
      export class FixtureEffects {
        @Effect({ dispatch: false })
        decorator = this.actions

        constructor(private actions: Actions){}
      }`,
  ],
  invalid: [
    {
      code: stripIndent`
        @Injectable()
        export class FixtureEffects {
          @Effect({ dispatch: false })
          both = createEffect(() => this.actions)

          constructor(private actions: Actions){}
        }`,
      errors: [
        {
          messageId,
          line: 4,
          column: 3,
          endLine: 4,
          endColumn: 7,
        },
      ],
    },
  ],
})
