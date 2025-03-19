import c from 'picocolors'
import isUnicodeSupported from 'is-unicode-supported'

const _isUnicodeSupported = isUnicodeSupported()
const s = (c: string, fallback: string) => (_isUnicodeSupported ? c : fallback)

export const symbols = {
  success: c.green(s('✔', '√')),
  info: c.blue(s('●', '•')),
  warn: c.blue(s('▲', '!')),
  error: c.blue(s('■', 'x')),
}
