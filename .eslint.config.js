module.exports = {
    root: true,
    overrides: [
      {
        files: ['server/**/*.ts'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
        ],
        rules: {
          '@typescript-eslint/naming-convention': [
            'error',
            {
              selector: 'variableLike',
              format: ['camelCase'],
            },
            {
              selector: 'function',
              format: ['camelCase'],
            },
          ],
        },
      },
      {
        files: ['web/**/*.ts', 'web/**/*.tsx'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
        ],
        rules: {
          '@typescript-eslint/naming-convention': [
            'error',
            {
              selector: 'variableLike',
              format: ['camelCase'],
            },
            {
              selector: 'function',
              format: ['camelCase'],
            },
          ],
        },
      },
    ],
  };
