import { stripIndent } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import rule, {
  ruleName,
  messageId,
} from '../../src/rules/no-effects-in-providers'
import { ruleTester } from '../utils'

ruleTester().run(ruleName, rule, {
  valid: [
    `
    @NgModule({
      imports: [
        StoreModule.forFeature('persons', {"foo": "bar"}),
        EffectsModule.forRoot([RootEffectOne]),
        EffectsModule.forFeature([FeatEffectOne]),
      ],
      providers: [FeatEffectTwo, UnRegisteredEffect, FeatEffectThree, RootEffectTwo],
    })
    export class AppModule {}`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
      @NgModule({
        imports: [
          StoreModule.forFeature('persons', {"foo": "bar"}),
          EffectsModule.forRoot([RootEffectOne, RootEffectTwo]),
          EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
          EffectsModule.forFeature([FeatEffectThree]),
        ],
        providers: [FeatEffectTwo, UnRegisteredEffect, FeatEffectThree, RootEffectTwo],
                    ~~~~~~~~~~~~~                                                       [${messageId}]
                                                       ~~~~~~~~~~~~~~~                  [${messageId}]
                                                                        ~~~~~~~~~~~~~   [${messageId}]
      })
      export class AppModule {}`,
    ),
    fromFixture(
      stripIndent`
      @NgModule({
        providers: [FeatEffectTwo, UnRegisteredEffect, FeatEffectThree, RootEffectTwo],
                    ~~~~~~~~~~~~~                                                       [${messageId}]
                                                       ~~~~~~~~~~~~~~~                  [${messageId}]
                                                                        ~~~~~~~~~~~~~   [${messageId}]
        imports: [
          StoreModule.forFeature('persons', {"foo": "bar"}),
          EffectsModule.forRoot([RootEffectOne, RootEffectTwo]),
          EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
          EffectsModule.forFeature([FeatEffectThree]),
        ],
      })
      export class AppModule {}`,
    ),
  ],
})
