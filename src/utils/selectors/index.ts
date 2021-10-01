export const effectCreator = `ClassProperty[value.callee.name='createEffect']`
export const createEffectExpression = `CallExpression[callee.name='createEffect']`

export const effectDecorator = `Decorator[expression.callee.name='Effect']`
export const classPropertyWithEffectDecorator =
  `ClassDeclaration > ClassBody > ClassProperty > ${effectDecorator}` as const

export const actionCreator = `CallExpression[callee.name='createAction']`
export const actionCreatorWithLiteral =
  `${actionCreator}[arguments.0.type='Literal'][arguments.0.raw=/^'/]` as const
export const actionCreatorProps = `${actionCreator} CallExpression` as const
export const actionCreatorPropsComputed =
  `${actionCreatorProps} > TSTypeParameterInstantiation > :matches(TSTypeReference[typeName.name!='Readonly'], [type=/^TS(.*)(Keyword|Type)$/])` as const

export const constructorExit = `MethodDefinition[kind='constructor']:exit`

export function metadataProperty(key: RegExp): string
export function metadataProperty<TKey extends string>(
  key: TKey,
): `Property:matches([key.name=${TKey}][computed=false], [key.value=${TKey}], [key.quasis.0.value.raw=${TKey}])`
export function metadataProperty(key: RegExp | string): string {
  return `Property:matches([key.name=${key}][computed=false], [key.value=${key}], [key.quasis.0.value.raw=${key}])`
}

export const injectedStore = `MethodDefinition[kind='constructor'] Identifier[typeAnnotation.typeAnnotation.typeName.name='Store']`
export const typedStore = `MethodDefinition[kind='constructor'] Identifier > TSTypeAnnotation > TSTypeReference[typeName.name='Store'][typeParameters.params]`

export const ngModuleDecorator = `ClassDeclaration > Decorator > CallExpression[callee.name='NgModule']`

export const ngModuleImports =
  `${ngModuleDecorator} ObjectExpression ${metadataProperty(
    'imports',
  )} > ArrayExpression` as const

export const ngModuleProviders =
  `${ngModuleDecorator} ObjectExpression ${metadataProperty(
    'providers',
  )} > ArrayExpression` as const

export const effectsInNgModuleImports =
  `${ngModuleImports} CallExpression[callee.object.name='EffectsModule'][callee.property.name=/^for(Root|Feature)$/] ArrayExpression > Identifier` as const

export const effectsInNgModuleProviders =
  `${ngModuleProviders} Identifier` as const

export const storeExpression = (storeName: string) =>
  `CallExpression:matches([callee.object.name='${storeName}'], [callee.object.object.type='ThisExpression'][callee.object.property.name='${storeName}'])` as const

export const storeExpressionCallable = (storeName: string) =>
  `CallExpression:matches([callee.object.callee.object.name='${storeName}'], [callee.object.callee.object.object.type='ThisExpression'][callee.object.callee.object.property.name='${storeName}'])` as const

export const storePipe = (storeName: string) =>
  `${storeExpression(storeName)}[callee.property.name='pipe']` as const

export const pipeableSelect = (storeName: string) =>
  `${storePipe(storeName)} CallExpression[callee.name='select']` as const

export const storeSelect = (storeName: string) =>
  `${storeExpression(storeName)}[callee.property.name='select']` as const

export const storeDispatch = (storeName: string) =>
  `${storeExpression(storeName)}[callee.property.name='dispatch']` as const

export const dispatchInEffects = (storeName: string) =>
  `${createEffectExpression} ${storeDispatch(
    storeName,
  )} > MemberExpression:has(Identifier[name='${storeName}'])` as const

export const createReducer = `CallExpression[callee.name='createReducer']`

export const onFunctionWithoutType =
  `${createReducer} CallExpression[callee.name='on'] > ArrowFunctionExpression:not([returnType.typeAnnotation], :has(CallExpression))` as const

export const storeActionReducerMap =
  `${ngModuleImports} CallExpression[callee.object.name='StoreModule'][callee.property.name=/^for(Root|Feature)$/] > ObjectExpression:first-child` as const

export const actionReducerMap = `VariableDeclarator[id.typeAnnotation.typeAnnotation.typeName.name='ActionReducerMap'] > ObjectExpression`

const mapLikeOperators = '/^(concat|exhaust|flat|merge|switch)Map$/'
const mapLikeToOperators = '/^(concat|merge|switch)MapTo$/'
export const mapLikeOperatorsExplicitReturn =
  `CallExpression[callee.name=${mapLikeOperators}] ReturnStatement` as const
export const mapLikeOperatorsImplicitReturn =
  `:matches(CallExpression[callee.name=${mapLikeToOperators}], CallExpression[callee.name=${mapLikeOperators}] > ArrowFunctionExpression)` as const
