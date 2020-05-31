export const effectCreator = `ClassProperty[value.callee.name='createEffect']`

export const effectDecorator = `ClassProperty > Decorator[expression.callee.name='Effect']`

export const actionCreator = `CallExpression[callee.name=/createAction.*/]`

export const reducerOn = `CallExpression[callee.name='createReducer'] > CallExpression[callee.name='on']`

export const constructorExit = `MethodDefinition[kind='constructor']:exit`

const actionDispatch =
  'ExpressionStatement:has(CallExpression > MemberExpression:has(Identifier[name="dispatch"]):has(MemberExpression > Identifier[name="store"]))'
export const multipleActionDispatch = `${actionDispatch} ~ ${actionDispatch}`

export const dispatchInEffects = `ClassProperty > CallExpression:has(Identifier[name="createEffect"]) CallExpression > MemberExpression:has(Identifier[name="dispatch"]):has(MemberExpression > Identifier[name="store"])`

export const injectedStore = `MethodDefinition[kind='constructor'] Identifier>TSTypeAnnotation>TSTypeReference[typeName.name="Store"]`

export const typedStore = `${injectedStore}[typeParameters.params]`

export const ngModuleDecorator = `ClassDeclaration > Decorator > CallExpression[callee.name='NgModule']`

export const ngModuleProviders = `${ngModuleDecorator} ObjectExpression Property[key.name='providers'] > ArrayExpression Identifier`

export const ngModuleImports = `${ngModuleDecorator} ObjectExpression Property[key.name='imports'] > ArrayExpression CallExpression[callee.object.name='EffectsModule'][callee.property.name=/forRoot|forFeature/] ArrayExpression > Identifier`

const pipeableSelect = `CallExpression[callee.property.name="pipe"] CallExpression[callee.name="select"]`
const storeSelect = `CallExpression[callee.object.name='store'][callee.property.name='select']`

export const select = `${pipeableSelect} Literal, ${storeSelect} Literal, ${pipeableSelect} ArrowFunctionExpression, ${storeSelect} ArrowFunctionExpression`

export const onFunctionWithoutType = `CallExpression[callee.name='createReducer'] CallExpression[callee.name='on'] > ArrowFunctionExpression:not([returnType.typeAnnotation],:has(CallExpression))`
