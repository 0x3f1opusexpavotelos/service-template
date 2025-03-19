import path from 'node:path'
import util from 'node:util'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import c from 'picocolors'
import { symbols } from './symbols'

export const cwd = () => path.dirname(fileURLToPath(import.meta.url))

export const enum ProgressEvent {
  ExecutCommand = 'execut command',
  CloneRepo = 'clone repo',
  CopyTempalte = 'copy template',
  RunScript = 'run script',
  PrintSummary = 'print summary',
  PrintDoneMessage = 'print done message',
}

export function progress(event: ProgressEvent, message: string): void {
  switch (event) {
    case ProgressEvent.ExecutCommand:
    case ProgressEvent.CloneRepo:
    case ProgressEvent.CopyTempalte:
      console.log(symbols.info, message)
      break
    case ProgressEvent.PrintDoneMessage:
      console.log('\n\n' + symbols.success, message)
      break
  }
}

const formatters: { [formatter: string]: (v: any) => string } = {}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */
const inspectOpts = Object.keys(process.env)
  .filter((key) => {
    return /^debug_/i.test(key)
  })
  .reduce(
    (obj: { [k: string]: any }, key) => {
      // Camel-case
      const prop = key
        .substring(6)
        .toLowerCase()
        .replace(/_([a-z])/g, (_, k) => {
          return k.toUpperCase()
        })

      // Coerce string value into JS value
      let val = process.env[key] ?? ''
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        obj[key] = true
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        obj[key] = false
      } else if (val === 'null') {
        obj[key] = null
      } else {
        obj[key] = Number(val)
      }

      obj[prop] = val
      return obj
    },
    { colors: true, breakLength: 1 }
  )

/**
 * Map %o to `util.inspect()`, all on a single line.
 */
formatters.o = function (v) {
  return util
    .inspect(v, inspectOpts)
    .split('\n')
    .map((str) => str.trim())
    .join(' ')
}

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */
formatters.O = function (v) {
  return util.inspect(v, inspectOpts)
}

function applyFormatter(args: any[]): string | string[] {
  const val = args[0]
  if (val instanceof Error) {
    return val.stack || val.message
  }

  if (typeof val !== 'string') {
    // Anything else let's inspect with %o
    args.unshift('%O')
  }
  // Apply any `formatters` transformations
  let index = 0
  args[0] = (args[0] as string).replace(/%([a-zA-Z%])/g, (match, format) => {
    // If we encounter an escaped % then don't increase the array index
    if (match === '%%') {
      return '%'
    }
    index++
    // Apply any `formatters` transformations
    const formatter = formatters[format]
    if (typeof formatter === 'function') {
      const val = args[index]
      match = formatter(val)

      // Now we need to remove `args[index]` since it's inlined in the `format`
      args.splice(index, 1)
      index--
    }
    return match
  })

  return args
}

export const step = (...args: any[]) => {
  process.stdout.write(
    util.formatWithOptions(inspectOpts, applyFormatter(args) + '\n')
  )
}

/**
 *
 * browser only !important
 */
function applyColorFormatter(args: any[]): void {
  // append/prend color placehodler
  args[0] = '%c' + symbols.info
  '%c' + args[0] + '%c' + symbols.success
  args.splice(1, 0, c.blue, 'color: inherit')

  // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  let index = 0
  let lastC = 0
  args[0] = (args[0] as string).replace(/%[a-zA-Z%]/g, (match) => {
    if (match === '%%') {
      return '%'
    }
    index++
    if (match === '%c') {
      // We only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index
    }
    return match
  })
  // apply color transformations
  args.splice(lastC, 0, c)
}
