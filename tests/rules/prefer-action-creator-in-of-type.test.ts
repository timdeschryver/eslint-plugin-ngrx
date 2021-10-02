import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/effects/prefer-action-creator-in-of-type'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [
    `
    @Injectable()
    class Test {
      effectOK = createEffect(() => this.actions$.pipe(ofType(userActions.ping)))

      constructor(private readonly actions$: Actions) {}
    }`,
    `
    @Injectable()
    class Test {
      effectOK1 = createEffect(() => this.actions$.pipe(ofType(userActions.ping.type)))

      constructor(private readonly actions$: Actions) {}
    }`,
    `
    @Injectable()
    class Test {
      effectOK2 = createEffect(() => this.actions$.pipe(ofType(method())))

      constructor(private readonly actions$: Actions) {}
    }`,
    `
    @Injectable()
    class Test {
      effectOK3 = createEffect(() => this.actions$.pipe(ofType(condition ? methodA() : bookActions.load)))

      constructor(private readonly actions$: Actions) {}
    }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      @Injectable()
      class Test {
        effectNOK = createEffect(() => this.actions$.pipe(ofType('PING')))
                                                                 ~~~~~~ [${messageId}]

        constructor(private readonly actions$: Actions) {}
      }`,
    ),
    fromFixture(
      stripIndent`
      @Injectable()
      class Test {
        effectNOK1 = createEffect(() => this.actions$.pipe(ofType(BookActions.load, 'PONG')))
                                                                                    ~~~~~~ [${messageId}]

        constructor(private readonly actions$: Actions) {}
      }`,
    ),
    fromFixture(
      stripIndent`
      @Injectable()
      class Test {
        effectNOK2 = createEffect(() =>
          this.actions$.pipe(ofType(legacy ? 'error here' : myAction)),
                                             ~~~~~~~~~~~~ [${messageId}]
        )

        constructor(private readonly actions$: Actions) {}
      }`,
    ),
  ],
})
