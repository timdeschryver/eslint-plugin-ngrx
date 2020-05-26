import actionHygiene, {
  ruleName as actionHygieneRuleName,
} from './action-hygiene'
import noDuplicateActionInReducer, {
  ruleName as noDuplicateActionInReducerRuleName,
} from './no-duplicate-action-in-reducer'
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

const ruleNames = {
  actionHygieneRuleName,
  noDuplicateActionInReducerRuleName,
  noEffectDecoratorAndCreatorRuleName,
  noTypedStoreRuleName,
  avoidDispatchingMultipleActionsSequentiallyRuleName,
  noMultipleStoresRuleName,
}

export const rules = {
  [ruleNames.actionHygieneRuleName]: actionHygiene,
  [ruleNames.noDuplicateActionInReducerRuleName]: noDuplicateActionInReducer,
  [ruleNames.noEffectDecoratorAndCreatorRuleName]: noEffectDecoratorAndCreator,
  [ruleNames.noTypedStoreRuleName]: noTypedStore,
  [ruleNames.avoidDispatchingMultipleActionsSequentiallyRuleName]: avoidDispatchingMultipleActionsSequentially,
  [ruleNames.noMultipleStoresRuleName]: noMultipleStores,
}
