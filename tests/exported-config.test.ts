import { test } from 'uvu'
import assert from 'uvu/assert'
import plugin from '../src'

test('exports all config', () => {
  assert.equal(Object.keys(plugin.configs), [
    'all',
    'component-store-strict',
    'component-store',
    'effects-strict',
    'effects',
    'recommended',
    'store-strict',
    'store',
    'strict',
  ])
})

test.run()
