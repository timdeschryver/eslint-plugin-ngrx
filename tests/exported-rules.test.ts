import path from 'path'
import { test } from 'uvu'
import assert from 'uvu/assert'
import * as lib from '../src/rules'
import { traverseFolder } from '../src/utils'

const rulesDirectory = path.join(__dirname, '../src/rules')

test('exports all rules', () => {
  const availableRules = [...traverseFolder(rulesDirectory)]
    .map((rule) => rule.file)
    .filter((rule) => rule !== 'index')
  assert.equal(Object.keys(lib.rules), availableRules)
})

test.run()
