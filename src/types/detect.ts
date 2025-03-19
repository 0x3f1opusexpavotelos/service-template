// check for which package manger is used

// search throught the current directories for lock files,
// if none exists, it'll crawl upwards to the parent directory and repeat the detection process
// until it reach the root directory(or repoRoot)

export type Agent =
  | 'npm'
  | 'yarn'
  | 'yarn@berry'
  | 'pnpm'
  | 'pnpm@6'
  | 'bun'
  | 'deno'

export const AGENTS: Agent[] = [
  'npm',
  'yarn',
  'yarn@berry',
  'pnpm',
  'bun',
  'deno',
]

export const LOCKS: Record<string, Agent> = {
  'bun.lock': 'bun',
  'deno.lock': 'deno',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
}

export const INSTALL_METADATA: Record<string, Agent> = {
  'node_modules/.deno/': 'deno',
  'node_modules/.pnpm/': 'pnpm',
}

export interface DetectResult {
  agent: string
  version: string
}

export type DetectStrategy =
  | 'lockfile'
  | 'packageManager-field'
  | 'devEngines-field'
  | 'instlal-metadata'
export interface DetectOption {
  /**
   * directory to start lookup for a package manager
   * @default `process.cwd()`
   */
  start?: string
  /**
   * The strategies to use for detecting package manager
   * the strategies are exeucted in order
   * - `lockfile`: Look for lock files
   * - `packageManager-field`: Look for packageManager field in package.json
   * - `install-metadata`: Look for install metadata added by package.json
   */
  strategies?: DetectStrategy[]
}
