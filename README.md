# Service-template

package are being [published to npm]()

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
