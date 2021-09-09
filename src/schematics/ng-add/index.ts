import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'

export default function (): Rule {
  return (host: Tree, context: SchematicContext) => {
    const eslintConfigPath = '.eslintrc.json'
    const docs =
      'https://github.com/timdeschryver/eslint-plugin-ngrx/#eslint-plugin-ngrx'

    const eslint = host.read(eslintConfigPath)?.toString('utf-8')
    if (!eslint) {
      context.logger.warn(`
Could not find the ESLint config at \`${eslintConfigPath}\`.
The NgRx ESLint Plugin is installed but not configured.

Please see ${docs} to configure the NgRx ESLint Plugin.
`)
      return host
    }

    try {
      const json = JSON.parse(eslint)
      if (json.overrides) {
        json.overrides
          .filter((override: { files?: string[] }) =>
            override.files?.some((file: string) => file.endsWith('*.ts')),
          )
          .forEach(configurePlugin)
      } else {
        configurePlugin(json)
      }

      host.overwrite(eslintConfigPath, JSON.stringify(json, null, 2))

      context.logger.info(`
  The NgRx ESLint Plugin is installed and configured with the recommended config.

  If you want to change the configuration, please see ${docs}.
  `)
      return host
    } catch (err) {
      context.logger.warn(`
Something went wrong while adding the NgRx ESLint Plugin.
The NgRx ESLint Plugin is installed but not configured.

Please see ${docs} to configure the NgRx ESLint Plugin.

Details:
${err.message}
`)
    }
  }
}

function configurePlugin(json: {
  plugins?: string[]
  extends?: string[]
}): void {
  json.plugins = [...new Set([...(json.plugins ?? []), 'ngrx')]
  json.extends = [...new Set([...(json.extends ?? []), 'plugin:ngrx/recommended')]
}
