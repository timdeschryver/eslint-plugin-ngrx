import actionHygiene, {
  ruleName as actionHygieneRuleName,
} from './action-hygiene'
import noEffectDecoratorAndCreator, {
  ruleName as noEffectDecoratorAndCreatorRuleName,
} from './no-effect-decorator-and-creator'
import noTypedStore, {
  ruleName as noTypedStoreRuleName,
} from './no-typed-store'
import avoidDispatchingMultipleActionsSequentially, {
  ruleName as avoidDispatchingMultipleActionsSequentiallyRuleName,
} from './avoid-dispatching-multiple-actions-sequentially'
import noMultipleStores, {
  ruleName as noMultipleStoresRuleName,
} from './no-multiple-stores'
import noDispatchInEffects, {
  ruleName as noDispatchInEffectsRuleName,
} from './no-dispatch-in-effects'
import noEffectDecorator, {
  ruleName as noEffectDecoratorRuleName,
} from './no-effect-decorator'
import noEffectsInProviders, {
  ruleName as noEffectsInProvidersRuleName,
} from './no-effects-in-providers'
import useSelectorInSelect, {
  ruleName as useSelectorInSelectRuleName,
} from './use-selector-in-select'
import onFunctionExplicitReturnType, {
  ruleName as onFunctionExplicitReturnTypeRuleName,
} from './on-function-explicit-return-type'

const ruleNames = {
  actionHygieneRuleName,
  noEffectDecoratorAndCreatorRuleName,
  noTypedStoreRuleName,
  avoidDispatchingMultipleActionsSequentiallyRuleName,
  noMultipleStoresRuleName,
  noDispatchInEffectsRuleName,
  noEffectDecoratorRuleName,
  noEffectsInProvidersRuleName,
  useSelectorInSelectRuleName,
  onFunctionExplicitReturnTypeRuleName,
}

export const rules = {
  [ruleNames.actionHygieneRuleName]: actionHygiene,
  [ruleNames.avoidDispatchingMultipleActionsSequentiallyRuleName]: avoidDispatchingMultipleActionsSequentially,
  [ruleNames.noDispatchInEffectsRuleName]: noDispatchInEffects,
  [ruleNames.noEffectDecoratorAndCreatorRuleName]: noEffectDecoratorAndCreator,
  [ruleNames.noEffectDecoratorRuleName]: noEffectDecorator,
  [ruleNames.noEffectsInProvidersRuleName]: noEffectsInProviders,
  [ruleNames.noMultipleStoresRuleName]: noMultipleStores,
  [ruleNames.noTypedStoreRuleName]: noTypedStore,
  [ruleNames.onFunctionExplicitReturnTypeRuleName]: onFunctionExplicitReturnType,
  [ruleNames.useSelectorInSelectRuleName]: useSelectorInSelect,
}
