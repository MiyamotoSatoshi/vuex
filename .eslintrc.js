module.exports = {
  root: true,
  parser: 'typescript-eslint-parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'standard'
  ],
  env: {
    browser: true
  },
  globals: {
    'expect': true,
    'describe': true,
    'it': true,
    'jest': true,
    'process': true
  },
  plugins: [
    'typescript',
    'eslint-plugin-local-rules'
  ],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': [2, 'as-needed'],
    'local-rules/no-render-string-reference': 2,
    // set maximum line characters
    'max-len': [2, 140, 4, {
      'ignoreUrls': true,
      'ignoreTemplateLiterals': true,
      'ignoreStrings': true
    }],
    'max-statements': [2, 24],
    'no-console': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-return-assign': 0,
    'prefer-promise-reject-errors': 0,
    'no-unused-vars': ['error', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false
    }],
    'no-empty': 'error',
    'object-curly-spacing': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'always',
        asyncArrow: 'always'
      }
    ],
    'no-return-await': 'warn'
  },
  overrides: [
    {
      files: '**/*.ts',
      rules: {
        // https://github.com/eslint/typescript-eslint-parser#known-issues
        'no-undef': 'off',
        'no-unused-vars': 'off',

        // https://github.com/eslint/typescript-eslint-parser/issues/445
        // 'typescript/no-unused-vars': 'error'

        // https://github.com/eslint/eslint/issues/10260
        'space-infix-ops': false,

        // Can't overload function exports with this enabled
        'import/export': false
      }
    }
  ]
}
