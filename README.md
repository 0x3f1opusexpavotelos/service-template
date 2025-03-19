🚧 package are being [published to npm](https://www.npmjs.com/package/service-template)


<h1 align="center">boostrap project like a breeze 🪄</h1>
<blockquote>
<p dir="auto"><code>serivce-tempalte</code> is a cli that helps boostrap new project or deploy template.</p>
</blockquote>

<p align="center">
<a href="https://npmjs.com/package/@stylistic/eslint-plugin-js"><img src="https://img.shields.io/npm/v/service-template?style=flat&colorA=1B3C4A&colorB=32A9C3" alt="npm version"></a>
</p>

<div align="center">

https://github.com/user-attachments/assets/be3361bc-3447-4f46-bf2c-3efcb561b892

</div>

```bash
npm pkg fix
npm login
npm publish
```

## Features

- ship with sdk and cli usage
- clone repo support
- copy template folder support
- run custom command support

## Quickstart


```bash
# npm
npm install --save-dev service-template
# pnpm
pnpm add --save-dev service-template
```

## Usage

With `pnpm`:

```bash
run the executable
pnpx service-template
```

or just add it your script

```json
"scripts": {
  "create-service": "service-template"
}
```

```bash
# run the script
pnpm create-service
```

```ts
// service.config.ts
import { defineConfig } from 'service-template'

export default defineConfig({
  // ...options
})
```
