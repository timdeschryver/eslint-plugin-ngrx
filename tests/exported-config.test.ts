import { test } from 'uvu'
import * as assert from 'uvu/assert'
import plugin from '../src'

test('exports all config', () => {
  assert.equal(Object.keys(plugin.configs), [
    'all',
    'component-store',
    'effects',
    'recommended',
    'store',
    'strict',
  ])
})

test.run()
