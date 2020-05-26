import { stripIndent } from 'common-tags'
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
    {
      code: stripIndent`
      @NgModule({
        imports: [
          StoreModule.forFeature('persons', {"foo": "bar"}),
          EffectsModule.forRoot([RootEffectOne, RootEffectTwo]),
          EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
          EffectsModule.forFeature([FeatEffectThree]),
        ],
        providers: [FeatEffectTwo, UnRegisteredEffect, FeatEffectThree, RootEffectTwo],
      })
      export class AppModule {}`,
      errors: [
        {
          messageId,
          line: 8,
          column: 15,
          endLine: 8,
          endColumn: 28,
        },
        {
          messageId,
          line: 8,
          column: 50,
          endLine: 8,
          endColumn: 65,
        },
        {
          messageId,
          line: 8,
          column: 67,
          endLine: 8,
          endColumn: 80,
        },
      ],
    },
    {
      code: stripIndent`
      @NgModule({
        providers: [FeatEffectTwo, UnRegisteredEffect, FeatEffectThree, RootEffectTwo],
        imports: [
          StoreModule.forFeature('persons', {"foo": "bar"}),
          EffectsModule.forRoot([RootEffectOne, RootEffectTwo]),
          EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
          EffectsModule.forFeature([FeatEffectThree]),
        ],
      })
      export class AppModule {}`,
      errors: [
        {
          messageId,
          line: 2,
          column: 15,
          endLine: 2,
          endColumn: 28,
        },
        {
          messageId,
          line: 2,
          column: 50,
          endLine: 2,
          endColumn: 65,
        },
        {
          messageId,
          line: 2,
          column: 67,
          endLine: 2,
          endColumn: 80,
        },
      ],
    },
  ],
})
