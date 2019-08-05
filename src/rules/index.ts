import actionHygiene, {
  ruleName as actionHygieneRuleName,
} from './action-hygiene'
import noEffectDecoratorAndCreator, {
  ruleName as noEffectDecoratorAndCreatorRuleName,
} from './no-effect-decorator-and-creator'

const ruleNames = {
  actionHygieneRuleName,
  noEffectDecoratorAndCreatorRuleName,
}

export const rules = {
  [ruleNames.actionHygieneRuleName]: actionHygiene,
  [ruleNames.noEffectDecoratorAndCreatorRuleName]: noEffectDecoratorAndCreator,
}
