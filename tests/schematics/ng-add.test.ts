import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'
import { test } from 'uvu'
import assert from 'uvu/assert'

const schematicRunner = new SchematicTestRunner(
  'eslint-plugin-ngrx',
  'src/schematics/collection.json',
)

test('registers the plugin', async () => {
  const appTree = new UnitTestTree(Tree.empty())

  const initialConfig = {}
  appTree.create('./.eslintrc.json', JSON.stringify(initialConfig, null, 2))

  await schematicRunner.runSchematicAsync('ng-add', {}, appTree).toPromise()

  const eslintContent = appTree.readContent(`.eslintrc.json`)
  const eslintJson = JSON.parse(eslintContent)
  assert.equal(eslintJson, {
    extends: ['plugin:ngrx/recommended'],
    plugins: ['ngrx'],
  })
})

test('registers the plugin in overrides when it supports TS', async () => {
  const appTree = new UnitTestTree(Tree.empty())

  // this is a trimmed down version of the default angular-eslint schematic
  const initialConfig = {
    overrides: [
      {
        files: ['*.ts'],
        parserOptions: {
          project: ['tsconfig.eslint.json'],
          createDefaultProgram: true,
        },
        extends: [
          'plugin:@angular-eslint/recommended',
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
          'plugin:@typescript-eslint/recommended-requiring-type-checking',
          'plugin:@angular-eslint/template/process-inline-templates',
          'plugin:prettier/recommended',
        ],
      },
      {
        files: ['*.html'],
        extends: [
          'plugin:@angular-eslint/template/recommended',
          'plugin:prettier/recommended',
        ],
        rules: {},
      },
    ],
  }
  appTree.create('.eslintrc.json', JSON.stringify(initialConfig, null, 2))

  await schematicRunner.runSchematicAsync('ng-add', {}, appTree).toPromise()

  const eslintContent = appTree.readContent(`.eslintrc.json`)
  const eslintJson = JSON.parse(eslintContent)
  assert.equal(eslintJson, {
    overrides: [
      {
        files: ['*.ts'],
        parserOptions: {
          project: ['tsconfig.eslint.json'],
          createDefaultProgram: true,
        },
        plugins: ['ngrx'],
        extends: [
          'plugin:@angular-eslint/recommended',
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
          'plugin:@typescript-eslint/recommended-requiring-type-checking',
          'plugin:@angular-eslint/template/process-inline-templates',
          'plugin:prettier/recommended',
          'plugin:ngrx/recommended',
        ],
      },
      {
        files: ['*.html'],
        extends: [
          'plugin:@angular-eslint/template/recommended',
          'plugin:prettier/recommended',
        ],
        rules: {},
      },
    ],
  })
})

test('does not add the plugin if it is already added manually', async () => {
  const appTree = new UnitTestTree(Tree.empty())

  const initialConfig = {
    plugins: ['ngrx'],
    extends: ['plugin:ngrx/recommended'],
  }
  appTree.create('.eslintrc.json', JSON.stringify(initialConfig, null, 2))

  await schematicRunner.runSchematicAsync('ng-add', {}, appTree).toPromise()

  const eslintContent = appTree.readContent(`.eslintrc.json`)
  const eslintJson = JSON.parse(eslintContent)
  assert.equal(eslintJson, initialConfig)
})

test.run()
