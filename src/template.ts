import { fileURLToPath } from 'node:url'
import path from 'node:path'
import colors from 'picocolors'

const { blue, cyan, green, greenBright, magenta, yellow } = colors

type ColorFunc = (str: string | number) => string
export type Framework = {
  name: string
  display: string
  color: ColorFunc
  variants: FrameworkVariant[]
}
export type FrameworkVariant = {
  name: string
  display: string
  color: ColorFunc
  customCommand?: string
  repoUrl?: string
}

export const FRAMEWORKS: Framework[] = [
  {
    name: 'service',
    display: 'choose the service',
    color: yellow,
    variants: [
      {
        name: 's3',
        display: 's3 bucket',
        color: yellow,
      },
      {
        name: 'create-hono',
        display: '',
        color: yellow,
        repoUrl: 'https://github.com/honojs/create-hono.git',
      },
    ],
  },
  {
    name: 'vue',
    display: 'Vue',
    color: green,
    variants: [
      {
        name: 'vue-ts',
        display: 'TypeScript',
        color: blue,
      },
      {
        name: 'vue',
        display: 'JavaScript',
        color: yellow,
      },
      {
        name: 'custom-create-vue',
        display: 'Official Vue Starter ↗',
        color: green,
        customCommand: 'npm create vue@latest TARGET_DIR',
      },
      {
        name: 'custom-nuxt',
        display: 'Nuxt ↗',
        color: greenBright,
        customCommand: 'npm exec nuxi init TARGET_DIR',
      },
    ],
  },
  {
    name: 'react',
    display: 'React',
    color: cyan,
    variants: [
      {
        name: 'react-ts',
        display: 'TypeScript',
        color: blue,
      },
      {
        name: 'react-swc-ts',
        display: 'TypeScript + SWC',
        color: blue,
      },
      {
        name: 'react',
        display: 'JavaScript',
        color: yellow,
      },
      {
        name: 'react-swc',
        display: 'JavaScript + SWC',
        color: yellow,
      },
      {
        name: 'custom-react-router',
        display: 'React Router v7 ↗',
        color: cyan,
        customCommand: 'npm create react-router@latest TARGET_DIR',
      },
    ],
  },
  {
    name: 'preact',
    display: 'Preact',
    color: magenta,
    variants: [
      {
        name: 'preact-ts',
        display: 'TypeScript',
        color: blue,
      },
      {
        name: 'preact',
        display: 'JavaScript',
        color: yellow,
      },
      {
        name: 'custom-create-preact',
        display: 'Official Preact Starter ↗',
        color: magenta,
        customCommand: 'npm create preact@latest TARGET_DIR',
      },
    ],
  },
  {
    name: 'solid',
    display: 'Solid',
    color: blue,
    variants: [
      {
        name: 'solid-ts',
        display: 'TypeScript',
        color: blue,
      },
      {
        name: 'solid',
        display: 'JavaScript',
        color: yellow,
      },
    ],
  },
]

// aggregrate template
export const TEMPLATES = FRAMEWORKS.map((f) =>
  f.variants.map((v) => v.name)
).reduce((a, b) => a.concat(b), [])

export function getTemplateDir(template: string): string {
  return path.resolve(
    fileURLToPath(import.meta.url),
    '../..',
    `template-${template}`
  )
}

export const cwd = process.cwd()
