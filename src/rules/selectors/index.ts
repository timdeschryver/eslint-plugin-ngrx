export const effectCreator = `ClassProperty[value.callee.name='createEffect']`
export const effectDecorator = `ClassProperty > Decorator[expression.callee.name='Effect']`
export const actionCreator = `CallExpression[callee.name=/createAction.*/]`
export const reducerAction = `CallExpression[callee.name='createReducer'] > CallExpression[callee.name='on'] > Identifier:first-child`
