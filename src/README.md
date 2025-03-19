interoprate typecheck with linter in pre-commit hooks or CI checks.

```json

"scripts": {
    "lint": "eslint"
    "typecheck": "tsc --noEmit"
}


"simple-git-hooks": {
    "pre-commit": [
            "npm run lint",
            "npm run type-check"
        ]
}
```

// bank transfers, payouts, and reconciliation
// acme: Automated Certificate Management Environment
