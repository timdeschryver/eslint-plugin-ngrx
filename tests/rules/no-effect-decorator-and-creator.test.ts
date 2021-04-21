import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/no-effect-decorator-and-creator'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
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
    fromFixture(
      stripIndent`
        @Injectable()
        export class FixtureEffects {
          @Effect({ dispatch: false })
          both = createEffect(() => this.actions)
          ~~~~ [${messageId}]

          constructor(private actions: Actions){}
        }`,
    ),
  ],
})
