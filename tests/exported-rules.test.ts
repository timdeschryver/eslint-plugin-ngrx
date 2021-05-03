import * as lib from '../src/rules'
import * as path from 'path'
import { traverseFolder } from '../src/utils'

const rulesDirectory = path.join(__dirname, '../src/rules')

test('exports all rules', () => {
  const availableRules = [...traverseFolder(rulesDirectory)]
    .map((rule) => rule.file)
    .filter((rule) => rule !== 'index')
  expect(Object.keys(lib.rules)).toEqual(availableRules)
})
