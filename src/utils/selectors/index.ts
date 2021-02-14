export const effectCreator = `ClassProperty[value.callee.name='createEffect']`

export const effectDecorator = `Decorator[expression.callee.name='Effect']`
export const classPropertyWithEffectDecorator = `ClassProperty > ${effectDecorator}`

export const actionCreator = `CallExpression[callee.name='createAction']`
export const actionCreatorWithLiteral = `${actionCreator}[arguments.0.type='Literal']`
export const actionCreatorProps = `${actionCreator} CallExpression`
export const actionCreatorPropsComputed = `${actionCreatorProps} > TSTypeParameterInstantiation > :matches(TSTypeReference[typeName.name!='Readonly'], [type=/^TS(.*)(Keyword|Type)$/])`

export const constructorExit = `MethodDefinition[kind='constructor']:exit`

export const dispatchInEffects = (storeName: string) =>
  `ClassProperty > CallExpression:has(Identifier[name="createEffect"]) CallExpression > MemberExpression:has(Identifier[name="dispatch"]):has(MemberExpression > Identifier[name=${storeName}])`

export const injectedStore = `MethodDefinition[kind='constructor'] Identifier[typeAnnotation.typeAnnotation.typeName.name="Store"]`
export const typedStore = `MethodDefinition[kind='constructor'] Identifier>TSTypeAnnotation>TSTypeReference[typeName.name="Store"][typeParameters.params]`

export const ngModuleDecorator = `ClassDeclaration > Decorator > CallExpression[callee.name='NgModule']`

export const ngModuleProviders = `${ngModuleDecorator} ObjectExpression Property[key.name='providers'] > ArrayExpression Identifier`

export const ngModuleImports = `${ngModuleDecorator} ObjectExpression Property[key.name='imports'] > ArrayExpression CallExpression[callee.object.name='EffectsModule'][callee.property.name=/forRoot|forFeature/] ArrayExpression > Identifier`

const storeExpression = (storeName: string) =>
  `CallExpression:matches([callee.object.name=${storeName}], [callee.object.object.type='ThisExpression'][callee.object.property.name=${storeName}])`

export const pipeableSelect = (storeName: string) =>
  `${storeExpression(
    storeName,
  )}[callee.property.name='pipe'] CallExpression[callee.name='select']`

export const storeSelect = (storeName: string) =>
  `${storeExpression(storeName)}[callee.property.name='select']`

export const onFunctionWithoutType = `CallExpression[callee.name='createReducer'] CallExpression[callee.name='on'] > ArrowFunctionExpression:not([returnType.typeAnnotation],:has(CallExpression))`

export const storeActionReducerMap = `${ngModuleDecorator} ObjectExpression Property[key.name='imports'] > ArrayExpression CallExpression[callee.object.name='StoreModule'][callee.property.name=/forRoot|forFeature/] > ObjectExpression > Property`

export const actionReducerMap = `VariableDeclarator[id.typeAnnotation.typeAnnotation.typeName.name='ActionReducerMap'] > ObjectExpression > Property`

const createEffectExpression = `ClassProperty > CallExpression[callee.name='createEffect']`

const mapOperators = '(concat|exhaust|flat|merge|switch)Map'
const mapToOperators = '(concat|merge|switch)MapTo'
const mapOperatorsExpression = `${createEffectExpression} CallExpression[callee.name=/^${mapOperators}$/]`
const mapToOperatorsExpression = `${createEffectExpression} CallExpression[callee.name=/^${mapToOperators}$/]`

export const effectsImplicitReturn = `${mapOperatorsExpression} > ArrowFunctionExpression > ArrayExpression, ${mapToOperatorsExpression} ArrayExpression`

export const effectsReturn = `${mapOperatorsExpression} ReturnStatement`
