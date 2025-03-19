/**
 * Options for the `versionBump()` function.
 */
export interface ServiceOptions {
  targetDir?: string
  service?: string
  serviceType?: string
  overwrite?: 'remove' | 'ignore' | 'cancel'
  template?: string
  /**
   * Any other properties will be passed directly to `readline.createInterface()`.
   * See the `ReadLineOptions` interface for possible options.
   */
  [key: string]: unknown
}
