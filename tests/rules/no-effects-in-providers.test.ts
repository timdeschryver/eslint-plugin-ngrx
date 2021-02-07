import { stripIndent, stripIndents } from 'common-tags'
import { fromFixture } from 'eslint-etc'
import path from 'path'
import rule, {
  messageId,
} from '../../src/rules/effects/no-effects-in-providers'
import { ruleTester } from '../utils'

ruleTester().run(path.parse(__filename).name, rule, {
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
        imports: [EffectsModule.forFeature([RegisteredEffect])],
        providers: [RegisteredEffect]
                    ~~~~~~~~~~~~~~~~ [${messageId}]
      })
      export class AppModule {}`,
      {
        output: stripIndent`
        @NgModule({
          imports: [EffectsModule.forFeature([RegisteredEffect])],
          providers: []
        })
        export class AppModule {}`,
      },
    ),
    fromFixture(
      stripIndents`
      @NgModule({
        imports: [EffectsModule.forRoot([RegisteredEffect])],
        providers: [
          RegisteredEffect// Let's see what happens with this comment?
          ~~~~~~~~~~~~~~~~ [${messageId}]
          ,
        ],
      })
      export class AppModule {}`,
      {
        output: stripIndents`
        @NgModule({
          imports: [EffectsModule.forRoot([RegisteredEffect])],
          providers: [
            // Let's see what happens with this comment?

          ],
        })
        export class AppModule {}`,
      },
    ),
    fromFixture(
      stripIndents`
      @NgModule({
        providers: [
          UnRegisteredEffect,
          FeatEffectTwo,
          ~~~~~~~~~~~~~ [${messageId}]


          UnRegisteredEffect2,
        ],
        'imports': [
          EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
        ],
      })
      export class AppModule {}

      @NgModule({
        imports: [EffectsModule.forFeature([UnRegisteredEffect])],
        providers: [],
      })
      export class SharedModule {}`,
      {
        output: stripIndents`
        @NgModule({
          providers: [
            UnRegisteredEffect,



            UnRegisteredEffect2,
          ],
          'imports': [
            EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
          ],
        })
        export class AppModule {}

        @NgModule({
          imports: [EffectsModule.forFeature([UnRegisteredEffect])],
          providers: [],
        })
        export class SharedModule {}`,
      },
    ),
    fromFixture(
      stripIndents`
      @NgModule({
        imports: [
          StoreModule.forFeature('persons', {"foo": "bar"}),
          EffectsModule.forRoot([RootEffectOne, RootEffectTwo]),
          EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
          EffectsModule.forFeature([FeatEffectThree]),
        ],
        ['providers']: [
          FeatEffectTwo,
          ~~~~~~~~~~~~~   [${messageId}]
          UnRegisteredEffect,
          FeatEffectThree/* Deprecated effect */,
          ~~~~~~~~~~~~~~~ [${messageId}]
          RootEffectTwo
          ~~~~~~~~~~~~~   [${messageId}]
        ],
      })
      export class AppModule {}`,
      {
        output: stripIndents`
        @NgModule({
          imports: [
            StoreModule.forFeature('persons', {"foo": "bar"}),
            EffectsModule.forRoot([RootEffectOne, RootEffectTwo]),
            EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
            EffectsModule.forFeature([FeatEffectThree]),
          ],
          ['providers']: [

            UnRegisteredEffect,
            /* Deprecated effect */

          ],
        })
        export class AppModule {}`,
      },
    ),
    fromFixture(
      stripIndents`
      @NgModule({
        [\`providers\`]: [
          FeatEffectTwo,
          ~~~~~~~~~~~~~   [${messageId}]
          FeatEffectThree,
          ~~~~~~~~~~~~~~~ [${messageId}]
          RootEffectTwo,
          ~~~~~~~~~~~~~   [${messageId}]
          UnRegisteredEffect
        ],
        ['imports']: [
          StoreModule.forFeature('persons', {"foo": "bar"}),
          EffectsModule.forRoot([RootEffectOne, RootEffectTwo]),
          EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
          EffectsModule.forFeature([FeatEffectThree]),
        ],
      })
      export class AppModule {}`,
      {
        output: stripIndents`
        @NgModule({
          [\`providers\`]: [



            UnRegisteredEffect
          ],
          ['imports']: [
            StoreModule.forFeature('persons', {"foo": "bar"}),
            EffectsModule.forRoot([RootEffectOne, RootEffectTwo]),
            EffectsModule.forFeature([FeatEffectOne, FeatEffectTwo]),
            EffectsModule.forFeature([FeatEffectThree]),
          ],
        })
        export class AppModule {}`,
      },
    ),
  ],
})
