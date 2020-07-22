export const effectCreator = `ClassProperty[value.callee.name='createEffect']`

export const effectDecorator = `ClassProperty > Decorator[expression.callee.name='Effect']`

export const actionCreator = `CallExpression[callee.name=/createAction.*/]`

export const constructorExit = `MethodDefinition[kind='constructor']:exit`

export const dispatchInEffects = `ClassProperty > CallExpression:has(Identifier[name="createEffect"]) CallExpression > MemberExpression:has(Identifier[name="dispatch"]):has(MemberExpression > Identifier[name="store"])`

export const injectedStore = `MethodDefinition[kind='constructor'] Identifier[typeAnnotation.typeAnnotation.typeName.name="Store"]`
export const typedStore = `MethodDefinition[kind='constructor'] Identifier>TSTypeAnnotation>TSTypeReference[typeName.name="Store"][typeParameters.params]`

export const ngModuleDecorator = `ClassDeclaration > Decorator > CallExpression[callee.name='NgModule']`

export const ngModuleProviders = `${ngModuleDecorator} ObjectExpression Property[key.name='providers'] > ArrayExpression Identifier`

export const ngModuleImports = `${ngModuleDecorator} ObjectExpression Property[key.name='imports'] > ArrayExpression CallExpression[callee.object.name='EffectsModule'][callee.property.name=/forRoot|forFeature/] ArrayExpression > Identifier`

export const pipeableSelect = `CallExpression[callee.property.name="pipe"] CallExpression[callee.name="select"]`
export const storeSelect = `CallExpression[callee.object.property.name='store'][callee.property.name='select']`

export const select = `${pipeableSelect} Literal, ${storeSelect} Literal, ${pipeableSelect} ArrowFunctionExpression, ${storeSelect} ArrowFunctionExpression`

export const onFunctionWithoutType = `CallExpression[callee.name='createReducer'] CallExpression[callee.name='on'] > ArrowFunctionExpression:not([returnType.typeAnnotation],:has(CallExpression))`

export const storeActionReducerMap = `${ngModuleDecorator} ObjectExpression Property[key.name='imports'] > ArrayExpression CallExpression[callee.object.name='StoreModule'][callee.property.name=/forRoot|forFeature/] > ObjectExpression > Property`

export const actionReducerMap = `VariableDeclarator[id.typeAnnotation.typeAnnotation.typeName.name='ActionReducerMap'] > ObjectExpression > Property`

const effectsOperator = `ClassProperty > CallExpression[callee.name='createEffect'] CallExpression[callee.name=/switchMap|concatMap|mergeMap|flatMap|exhaustMap/]`

export const effectsArrowReturn = `${effectsOperator} > ArrowFunctionExpression > ArrayExpression`

export const effectsReturn = `${effectsOperator} ReturnStatement`
