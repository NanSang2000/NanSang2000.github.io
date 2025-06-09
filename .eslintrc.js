module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript'
  ],
  overrides: [
    {
      files: ['*.mdx'],
      extends: 'plugin:mdx/recommended'
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: [
    'react'
  ],
  rules: {
    'brace-style': 'off',
    'block-spacing': 'off',
    'padded-blocks': 'off',
    'react/jsx-curly-brace-presence': 'off',
    indent: 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    'react/no-children-prop': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'semi': ['error', 'never'],
    'space-before-function-paren': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'eol-last': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'no-trailing-spaces': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
    '@typescript-eslint/indent': 'off'
  },
  settings: {
    'mdx/code-blocks': false,
    'mdx/language-mapper': {}
  }
}
