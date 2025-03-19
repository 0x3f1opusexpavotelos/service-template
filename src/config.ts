import type { ServiceOptions } from './types/service-options'
import { dirname } from 'node:path'
import process from 'node:process'
import { loadConfig } from 'c12'
import escalade from 'escalade/sync'

export const serviceConfigDefaults: ServiceOptions = {
  service: '',
  serviceType: 's3',
}

// 	retryOpts = Object.assign({}, retryDefaults, retryOpts);

export async function loadServiceConfig(
  overrides?: Partial<ServiceOptions>,
  cwd = process.cwd()
) {
  const name = 'service'
  const configFile = findConfigFile(name, cwd)
  const { config } = await loadConfig<ServiceOptions>({
    name,
    defaults: serviceConfigDefaults,
    overrides: {
      ...(overrides as ServiceOptions),
    },
    cwd: configFile ? dirname(configFile) : cwd,
  })
  return config!
}

function findConfigFile(name: string, cwd: string) {
  let foundRepositoryRoot = false
  try {
    const candidates = ['js', 'mjs', 'ts', 'mts', 'json'].map(
      (ext) => `${name}.config.${ext}`
    )
    return escalade(cwd, (_dir, files) => {
      const match = files.find((file) => {
        if (candidates.includes(file)) return true
        if (file === '.git') foundRepositoryRoot = true
        return false
      })

      if (match) return match

      // Stop at the repository root.
      if (foundRepositoryRoot) {
        // eslint-disable-next-line no-throw-literal
        throw null
      }

      return false
    })
  } catch (error) {
    if (foundRepositoryRoot) return null
    throw error
  }
}

export function defineConfig(config: Partial<ServiceOptions>) {
  return config
}
