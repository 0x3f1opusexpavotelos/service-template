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



## Support Further 

- [![GitHub Sponsors](https://img.shields.io/badge/-black?style=social&logo=githubsponsors&label=GitHub%20Sponsor%3A%20Street%20Side%20Software)](https://github.com/sponsors/0x3f1opusexpavotelos)
- [![Patreon](https://img.shields.io/badge/-black?style=social&logo=patreon&label=Patreon%3A%20Street%20Side%20Software)](https://patreon.com/0x3f1opusexpavotelos)
- [![PayPal](https://img.shields.io/badge/-black?style=social&logo=paypal&label=PayPal%20Donate%3A%20Street%20Side%20Software)](https://www.paypal.com/donate/?hosted_button_id=)
- [![Open Collective](https://img.shields.io/badge/-black?style=social&logo=opencollective&label=Open%20Collective%3A%20Code%20Spell%20Checker)](https://opencollective.com/0x3f1opusexpavotelos)


## Features

- ship with sdk and cli usage
- clone repo support
- copy template folder support
- run custom command support
- Supports config file `service.config.ts`:

## Quickstart


```bash
# npm
npm install --save-dev service-template
# pnpm
pnpm add --save-dev service-template
```

## Usage

With any package manager you perfer

```bash
# run the executable
# pnpm
pnpx service-template
# npm
npx serivce-template
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

use config file to specify option

```ts
// service.config.ts
import { defineConfig } from 'service-template'

export default defineConfig({
  // ...options
})
```
