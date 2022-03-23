import { test } from 'uvu'
import assert from 'uvu/assert'
import plugin from '../src'

test('exports all config', () => {
  assert.equal(Object.keys(plugin.configs).length, 14)
})

test.run()
