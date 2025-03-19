import { version } from '../../package.json'
import cac from 'cac'
import process from 'node:process'
import { loadServiceConfig } from '../config'
import { ServiceOptions } from '../types/service-options'
import { ExitCode } from './exit-code'
import colors from 'picocolors'
/**
 * The parsed command-line arguments
 */
export interface ParsedArgs {
  help?: boolean
  version?: boolean
  quiet?: boolean
  options: ServiceOptions
}

interface HelpSection {
  title?: string
  body: string
}

const {
  blue,
  blueBright,
  cyan,
  green,
  greenBright,
  magenta,
  red,
  redBright,
  reset,
  yellow,
} = colors

const helpAppend = (sections: HelpSection[]): void | HelpSection[] => {
  // prettier-ignore
  const appendSections:HelpSection[] = [
    {
      title: "Available templates",
      body: `
${yellow    ('vanilla-ts     vanilla'  )}
${green     ('vue-ts         vue'      )}
${cyan      ('react-ts       react'    )}
${cyan      ('react-swc-ts   react-swc')}
${magenta   ('preact-ts      preact'   )}
${redBright ('lit-ts         lit'      )}
${red       ('svelte-ts      svelte'   )}
${blue      ('solid-ts       solid'    )}
${blueBright('qwik-ts        qwik'     )}`    
    }
  ]
  return sections.concat(appendSections)
}

/**
 * Parses the command-line arguments
 */
export async function parseArgs(): Promise<ParsedArgs> {
  try {
    const { args, opts } = loadCliArgs()

    const parsedArgs: ParsedArgs = {
      help: opts.help as boolean,
      version: opts.version as boolean,
      quiet: opts.quiet as boolean,
      options: await loadServiceConfig({
        targetDir: [...(opts['--'] || []), ...args][0],
        serviceType: opts.serviceType,
        overwrite: opts.overwrite,
      }),
    }

    return parsedArgs
  } catch (error) {
    // There was an error parsing the command-line args
    return errorHandler(error as Error)
  }
}

export function loadCliArgs(argv = process.argv) {
  const cli = cac('service-template')

  cli
    .version(version)
    .usage('[OPTION]  ... [DIRECTORY]')
    //   .option('--no-commit', 'Skip commit', { default: false })
    .option('-q, --quiet', 'Quiet mode')

    .option(
      '-c, --config <config-file>',
      'Commands to execute after version bumps'
    )
    .option(
      '-s, --service <service-type>',
      'Commands to execute after version bumps'
    )
    .option(
      '-t, --service-type <service-name>',
      'Commands to execute after version bumps'
    )
    .option('--overwrite <overwrite-type>', 'overwrite targetDir if not empty')
    .help(helpAppend)

  //   interface ParsedArgv {
  //     args: ReadonlyArray<string>;
  //     options: {
  //         [k: string]: any;
  //     };
  // }
  const result = cli.parse(argv)
  const rawArgs = cli.rawArgs

  const OVERRIDE_REG = /(?:-o|--overwrite)(?:=.*|$)/
  const TEMPALTE_REG = /(?:-t|--template)(?:=.+)/
  const hasOverwriteFlags = rawArgs.some((arg) => OVERRIDE_REG.test(arg))
  const hasTemplateFalgs = rawArgs.some((arg) => TEMPALTE_REG.test(arg))

  const { overrides, template, ...rest } = result.options

  // const TEMPALTE_REG = /(?:-t|--template)(?:=.+)/;
  // console.log(TEMPALTE_REG.test('--template=vue')); // true
  // console.log(TEMPALTE_REG.test('--template=')); // false
  // console.log(TEMPALTE_REG.test('--template')); // false

  return {
    opts: {
      ...rest,
      overrides: hasOverwriteFlags ? 'cancel' : undefined,
      template: hasTemplateFalgs ? template : undefined,
    } as { [k: string]: any },
    args: result.args,
  }
}

function errorHandler(error: Error): never {
  console.error(error.message)
  return process.exit(ExitCode.InvalidArgument)
}
