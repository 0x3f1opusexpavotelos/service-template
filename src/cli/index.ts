import process from 'node:process'
import { loadCliArgs, parseArgs } from './parse-args'
import { serviceTemplate } from '../service-template'

export enum ExitCode {
  Success = 0,
  FatalError = 1,
  InvalidArgument = 9,
}

export async function main(): Promise<void> {
  try {
    // Setup global error handlers
    process.on('uncaughtException', errorHandler)
    process.on('unhandledRejection', errorHandler)

    const { help, version, options } = await parseArgs()

    if (help || version) {
      // Will be handled by cac, just need to exit
      process.exit(ExitCode.Success)
    }

    await serviceTemplate(options)
  } catch (error) {
    errorHandler(error as Error)
  }
}

function errorHandler(error: Error): void {
  let message = error.message || String(error)

  if (process.env.DEBUG || process.env.NODE_ENV === 'development')
    message += `\n\n${error.stack || ''}`

  console.error(message)
  process.exit(ExitCode.FatalError)
}
