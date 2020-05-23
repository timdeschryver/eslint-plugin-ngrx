export const effectCreator = `ClassProperty[value.callee.name='createEffect']`
export const effectDecorator = `ClassProperty > Decorator[expression.callee.name='Effect']`
export const actionCreator = `CallExpression[callee.name=/createAction.*/]`
export const reducerOn = `CallExpression[callee.name='createReducer'] > CallExpression[callee.name='on']`
export const store = `MethodDefinition[kind='constructor'] TSTypeReference[typeName.name='Store'][typeParameters.params]`
const actionDispatch =
  'ExpressionStatement:has(CallExpression > MemberExpression:has(Identifier[name="dispatch"]):has(MemberExpression > Identifier[name="store"]))'
export const multipleActionDispatch = `${actionDispatch} ~ ${actionDispatch}`
