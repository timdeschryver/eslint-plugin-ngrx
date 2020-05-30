import * as lib from '../src/rules'
import * as fs from 'fs'
import * as path from 'path'

const rulesDirectory = fs.readdirSync(path.join(__dirname, '../src/rules'))

it('should export all rules', () => {
  const availableRules = rulesDirectory
    .map(rule => rule.replace('.ts', ''))
    .filter(rule => rule !== 'index')
  expect(Object.keys(lib.rules)).toEqual(availableRules)
})
