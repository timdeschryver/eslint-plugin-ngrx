import { Tree } from '@angular-devkit/schematics'
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing'

const schematicRunner = new SchematicTestRunner(
  'eslint-plugin-ngrx',
  'src/schematics/collection.json',
)

it('should register the plugin', async () => {
  const appTree = new UnitTestTree(Tree.empty())

  const initialConfig = {}
  appTree.create('./.eslintrc.json', JSON.stringify(initialConfig, null, 2))

  await schematicRunner.runSchematicAsync('ng-add', {}, appTree).toPromise()

  const eslintContent = appTree.readContent(`.eslintrc.json`)
  const eslintJson = JSON.parse(eslintContent)
  expect(eslintJson).toEqual({
    extends: ['plugin:ngrx/recommended'],
    plugins: ['ngrx'],
  })
})

it('should register the plugin in overrides when it supports TS', async () => {
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
  expect(eslintJson).toEqual({
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
