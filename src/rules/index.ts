import actionHygiene, {
  ruleName as actionHygieneRuleName,
} from './action-hygiene'
import avoidDispatchingMultipleActionsSequentially, {
  ruleName as avoidDispatchingMultipleActionsSequentiallyRuleName,
} from './avoid-dispatching-multiple-actions-sequentially'
import noDispatchInEffects, {
  ruleName as noDispatchInEffectsRuleName,
} from './no-dispatch-in-effects'
import noEffectDecorator, {
  ruleName as noEffectDecoratorRuleName,
} from './no-effect-decorator'
import noEffectDecoratorAndCreator, {
  ruleName as noEffectDecoratorAndCreatorRuleName,
} from './no-effect-decorator-and-creator'
import noEffectsInProviders, {
  ruleName as noEffectsInProvidersRuleName,
} from './no-effects-in-providers'
import noMultipleStores, {
  ruleName as noMultipleStoresRuleName,
} from './no-multiple-stores'
import noReducerInKeyNames, {
  ruleName as noReducerInKeyNamesRuleName,
} from './no-reducer-in-key-names'
import noTypedStore, {
  ruleName as noTypedStoreRuleName,
} from './no-typed-store'
import onFunctionExplicitReturnType, {
  ruleName as onFunctionExplicitReturnTypeRuleName,
} from './on-function-explicit-return-type'
import selectStyle, { ruleName as selectStyleRuleName } from './select-style'
import useSelectorInSelect, {
  ruleName as useSelectorInSelectRuleName,
} from './use-selector-in-select'

const ruleNames = {
  actionHygieneRuleName,
  avoidDispatchingMultipleActionsSequentiallyRuleName,
  noDispatchInEffectsRuleName,
  noEffectDecoratorRuleName,
  noEffectDecoratorAndCreatorRuleName,
  noEffectsInProvidersRuleName,
  noMultipleStoresRuleName,
  noReducerInKeyNamesRuleName,
  noTypedStoreRuleName,
  onFunctionExplicitReturnTypeRuleName,
  selectStyleRuleName,
  useSelectorInSelectRuleName,
}

export const rules = {
  [ruleNames.actionHygieneRuleName]: actionHygiene,
  [ruleNames.avoidDispatchingMultipleActionsSequentiallyRuleName]: avoidDispatchingMultipleActionsSequentially,
  [ruleNames.noDispatchInEffectsRuleName]: noDispatchInEffects,
  [ruleNames.noEffectDecoratorAndCreatorRuleName]: noEffectDecoratorAndCreator,
  [ruleNames.noEffectDecoratorRuleName]: noEffectDecorator,
  [ruleNames.noEffectsInProvidersRuleName]: noEffectsInProviders,
  [ruleNames.noMultipleStoresRuleName]: noMultipleStores,
  [ruleNames.noReducerInKeyNamesRuleName]: noReducerInKeyNames,
  [ruleNames.noTypedStoreRuleName]: noTypedStore,
  [ruleNames.onFunctionExplicitReturnTypeRuleName]: onFunctionExplicitReturnType,
  [ruleNames.selectStyleRuleName]: selectStyle,
  [ruleNames.useSelectorInSelectRuleName]: useSelectorInSelect,
}
