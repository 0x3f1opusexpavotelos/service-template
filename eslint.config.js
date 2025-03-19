import { antfu } from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
    'no-restricted-syntax': 'off',
    'style/brace-style': 'off',
    'no-unused-vars': 'warn',
    'no-unused-imports': 'warn',
  },
})
