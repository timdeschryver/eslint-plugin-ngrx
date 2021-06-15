import plugin from '../src'

test('exports all config', () => {
  expect(Object.keys(plugin.configs)).toMatchInlineSnapshot(`
    Array [
      "all",
      "component-store",
      "effects",
      "recommended",
      "store",
      "strict",
    ]
  `)
})
