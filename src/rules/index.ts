import fs from 'fs'
import path from 'path'

import { TSESLint } from '@typescript-eslint/experimental-utils'

type RuleModule = TSESLint.RuleModule<string, unknown[]> & {
  meta: { module: string }
}

// Copied from https://github.com/jest-community/eslint-plugin-jest/blob/main/src/index.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const interopRequireDefault = (obj: any): { default: unknown } =>
  obj?.__esModule ? obj : { default: obj }

const importDefault = (moduleName: string) =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  interopRequireDefault(require(moduleName)).default

const rulesDir = __dirname
const excludedFiles = ['index']

export const rules = Array.from(traverseFolder(rulesDir))
  .filter((rule) => !excludedFiles.includes(rule.file))
  .reduce((allRules, rule) => {
    const ruleModule = importDefault(rule.path) as RuleModule
    ruleModule.meta.module = path.basename(path.dirname(rule.path))
    return {
      ...allRules,
      [rule.file]: ruleModule,
    }
  }, {} as Record<string, RuleModule>)

function* traverseFolder(
  folder: string,
  extension = '.ts',
): Generator<{ folder: string; file: string; path: string }> {
  const folders = fs.readdirSync(folder, { withFileTypes: true }) as fs.Dirent[]
  for (const folderEntry of folders) {
    if (folderEntry.name.includes('node_modules')) {
      // ignore folder
      continue
    }
    const entryPath = path.resolve(folder, folderEntry.name)
    if (folderEntry.isDirectory()) {
      yield* traverseFolder(entryPath, extension)
    } else if (path.extname(entryPath) === extension) {
      yield { folder, file: path.parse(folderEntry.name).name, path: entryPath }
    }
  }
}
