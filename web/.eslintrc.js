module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [],
  rules: {
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['UPPER_CASE', 'camelCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase', 'camelCase'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase'],
          },
          {
            selector: 'variable',
            modifiers: ['const'],
            format: ['UPPER_CASE', 'camelCase'],
          },
          {
            selector: 'interface',
            format: ['PascalCase', 'camelCase'],
          },
        ],
      },
    },
    {
      files: ['**/*.tsx'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase'],
          },
          {
            selector: 'variable',
            modifiers: ['const'],
            format: ['UPPER_CASE', 'camelCase', 'PascalCase'],
          },
          {
            selector: 'interface',
            format: ['PascalCase', 'camelCase'],
          },
        ],
      },
    },
  ],
};
