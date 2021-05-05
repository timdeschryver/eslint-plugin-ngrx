import plugin from '../src'

test('exports all config', () => {
  expect(Object.keys(plugin.configs)).toEqual([
    'all',
    'effects',
    'recommended',
    'store',
    'strict',
  ])
})
