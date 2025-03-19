---
title: service-template
---

## Features

- ship with sdk and cli usage
- clone repo support
- copy template folder support
- run custom command support

## Usage

With PNPM:

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
// bump.config.ts
import { defineConfig } from 'service-template'

export default defineConfig({
  // ...options
})
```
