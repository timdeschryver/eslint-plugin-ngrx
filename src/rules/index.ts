import goodActionHygiene, {
  ruleName as goodActionHygieneRuleName,
} from './good-action-hygiene'
import avoidCombiningSelectors, {
  ruleName as avoidCombiningSelectorsRuleName,
} from './avoid-combining-selectors'
import avoidDispatchingMultipleActionsSequentially, {
  ruleName as avoidDispatchingMultipleActionsSequentiallyRuleName,
} from './avoid-dispatching-multiple-actions-sequentially'
import avoidMappingSelectors, {
  ruleName as avoidMappingSelectorsRuleName,
} from './avoid-mapping-selectors'
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
import noMultipleActionsInEffects, {
  ruleName as noMultipleActionsInEffectsRuleName,
} from './no-multiple-actions-in-effects'
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
import preferInlineActionProps, {
  ruleName as preferInlineActionPropsRuleName,
} from './prefer-inline-action-props'
import selectStyle, { ruleName as selectStyleRuleName } from './select-style'
import useLifecycleInterface, {
  ruleName as useLifecycleInterfaceRuleName,
} from './use-lifecycle-interface'
import useSelectorInSelect, {
  ruleName as useSelectorInSelectRuleName,
} from './use-selector-in-select'

const ruleNames = {
  actionHygieneRuleName: goodActionHygieneRuleName,
  avoidCombiningSelectorsRuleName,
  avoidDispatchingMultipleActionsSequentiallyRuleName,
  avoidMappingSelectorsRuleName,
  noDispatchInEffectsRuleName,
  noEffectDecoratorAndCreatorRuleName,
  noEffectDecoratorRuleName,
  noEffectsInProvidersRuleName,
  noMultipleActionsInEffectsRuleName,
  noMultipleStoresRuleName,
  noReducerInKeyNamesRuleName,
  noTypedStoreRuleName,
  onFunctionExplicitReturnTypeRuleName,
  preferInlineActionPropsRuleName,
  selectStyleRuleName,
  useLifecycleInterfaceRuleName,
  useSelectorInSelectRuleName,
}

export const rules = {
  [ruleNames.actionHygieneRuleName]: goodActionHygiene,
  [ruleNames.avoidCombiningSelectorsRuleName]: avoidCombiningSelectors,
  [ruleNames.avoidDispatchingMultipleActionsSequentiallyRuleName]: avoidDispatchingMultipleActionsSequentially,
  [ruleNames.avoidMappingSelectorsRuleName]: avoidMappingSelectors,
  [ruleNames.noDispatchInEffectsRuleName]: noDispatchInEffects,
  [ruleNames.noEffectDecoratorAndCreatorRuleName]: noEffectDecoratorAndCreator,
  [ruleNames.noEffectDecoratorRuleName]: noEffectDecorator,
  [ruleNames.noEffectsInProvidersRuleName]: noEffectsInProviders,
  [ruleNames.noMultipleActionsInEffectsRuleName]: noMultipleActionsInEffects,
  [ruleNames.noMultipleStoresRuleName]: noMultipleStores,
  [ruleNames.noReducerInKeyNamesRuleName]: noReducerInKeyNames,
  [ruleNames.noTypedStoreRuleName]: noTypedStore,
  [ruleNames.onFunctionExplicitReturnTypeRuleName]: onFunctionExplicitReturnType,
  [ruleNames.preferInlineActionPropsRuleName]: preferInlineActionProps,
  [ruleNames.selectStyleRuleName]: selectStyle,
  [ruleNames.useLifecycleInterfaceRuleName]: useLifecycleInterface,
  [ruleNames.useSelectorInSelectRuleName]: useSelectorInSelect,
} as const
