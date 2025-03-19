import path from 'node:path'
import fs from 'node:fs'
import { x } from 'tinyexec'

import {
  Agent,
  AGENTS,
  DetectOption,
  DetectResult,
  LOCKS,
} from '../types/detect'

interface PkgInfo {
  agent: string
  version: string
}

export function pkgInfoFromAgent(
  userAgent: string | undefined = process.env.npm_config_user_agent
): DetectResult | undefined {
  console.log(userAgent)
  if (!userAgent) {
    return undefined
  }

  const agentSpec = userAgent.split(' ')[0]
  const pkgSpec = agentSpec.split('/')
  return {
    agent: pkgSpec[0],
    version: pkgSpec[1],
  }
}

export function pathExists(path: string, type: 'file' | 'dir') {
  try {
    const stat = fs.statSync(path)
    return type === 'file' ? stat.isFile() : stat.isDirectory()
  } catch {
    return false
  }
}

let foundRepoRoot = false

// escalade, crawlup
function* lookup(
  cwd: string = process.cwd(),
  callback?: (directory: string, contents: string[]) => string | false | void
): Generator<string> {
  let directory = path.resolve('.', cwd)
  const contents = fs.readdirSync(cwd)
  callback?.(directory, contents)

  while (!foundRepoRoot) {
    yield directory
    if (contents.find((content) => content === '.git')) foundRepoRoot = true
    else directory = path.dirname(directory)
  }
}

export function detect(
  options: DetectOption
): Partial<DetectResult> | undefined {
  const { start, strategies = ['lockfile', 'packageManager-field'] } = options

  for (const directory of lookup(start)) {
    for (const strategy of strategies) {
      switch (strategy) {
        case 'lockfile': {
          for (const lock of Object.keys(LOCKS)) {
            if (pathExists(path.join(directory, lock), 'file')) {
              const name = LOCKS[lock]
              const result = parsePkgJson(path.join(directory, 'package.json'))
              if (result) return result
              else return { agent: name }
            }
          }
          break
        }
        case 'packageManager-field':
        case 'devEngines-field': {
          const result = parsePkgJson(path.join(directory, 'package.json'))
          if (result) return result
          break
        }
      }
    }
  }
  return undefined
}

function getNameAndVerFromPkg(pkg: {
  packageManager?: string
  devEngines?: { packageManager?: { name?: string; version?: string } }
}) {
  const hanldeVer = (version: string | undefined) =>
    version?.match(/\d+(\.\d+){0,2}(-.+)/)?.[0] ?? version
  if (typeof pkg.packageManager === 'string') {
    const [name, ver] = pkg.packageManager.replace(/\^/, '').split('@')
    return {
      name,
      ver: hanldeVer(ver),
    }
  }

  if (typeof pkg.devEngines?.packageManager?.name === 'string') {
    return {
      name: pkg.devEngines.packageManager.name,
      ver: hanldeVer(pkg.devEngines.packageManager.version),
    }
  }

  return undefined
}

function parsePkgJson(filepath: string): Partial<DetectResult> | undefined {
  if (!pathExists(filepath, 'file')) undefined

  try {
    const pkg = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
    let agent: Agent | undefined
    const nameAndVer = getNameAndVerFromPkg(pkg)
    if (nameAndVer) {
      const name = nameAndVer.name as Agent
      const ver = nameAndVer.ver
      let version = ver
      if (name === 'yarn' && ver && Number.parseInt(ver) > 1) {
        agent = 'yarn@berry'
        // the version in packageManager isn't the actual yarn package version
        version = 'berry'
        return { agent, version }
      } else if (name === 'pnpm' && ver && Number.parseInt(ver) < 7) {
        agent = 'pnpm@6'
        return { agent, version }
      } else if (AGENTS.includes(name)) {
        agent = name as Agent
        return { agent, version }
      }
    }
    return undefined
  } catch {}
  return undefined
}

/**
 * Construct/Transform the command from the agent chocie
 * @param value {AgentCommandValue} The agent command to use.
 * @param args The arguments to pass to the command.
 * @returns {ResolvedCommand}
 */

export interface ResolvedCommand {
  /**
   * CLI command.
   */
  command: string
  /**
   * Arguments for the CLI command, merged with user arguments.
   */
  args: string[]
}

export function constructCommand(
  commandString: string,
  pkgInfo?: PkgInfo
): string {
  const pkgManager = pkgInfo ? pkgInfo.agent : 'npm'
  const isYarn1 = pkgManager === 'yarn' && pkgInfo?.version.startsWith('1.')

  return (
    commandString
      .replace(/^npm create /, () => {
        return `${pkgManager} create `
      })
      // Only Yarn 1.x doesn't support `@version` in the `create` command
      .replace('@latest', () => (isYarn1 ? '' : '@latest'))
      .replace(/^npm exec/, () => {
        // script runner, respect package choice
        if (pkgManager === 'pnpm') {
          return 'pnpm dlx'
        }
        if (pkgManager === 'yarn' && !isYarn1) {
          return 'yarn dlx'
        }
        if (pkgManager === 'bun') {
          return 'bun x'
        }
        return 'npm exec'
      })
  )
}

export const run = (
  bin: string,
  args: string[],
  opts: { [k: string]: any } = {}
) => x(bin, args, { throwOnError: true, ...opts })
