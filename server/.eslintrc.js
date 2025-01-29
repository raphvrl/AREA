// module.exports = {
//     root: true,
//     parser: '@typescript-eslint/parser',
//     plugins: ['@typescript-eslint'],
//     extends: [
//       'eslint:recommended',
//       'plugin:@typescript-eslint/recommended',
//     ],
//     rules: {
//       '@typescript-eslint/naming-convention': [
//         'warn',
//         {
//           selector: 'variableLike',
//           format: ['camelCase'],
//         },
//         {
//           selector: 'function',
//           format: ['camelCase'],
//         },
//       ],
//     },
//   };




module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [], // Ne pas utiliser de configurations recommandées
    rules: {
      // Désactiver toutes les règles par défaut
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-extra-semi': 'off',
      '@typescript-eslint/no-extra-parens': 'off',
      '@typescript-eslint/no-misused-new': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-array-constructor': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      '@typescript-eslint/type-annotation-spacing': 'off',
      '@typescript-eslint/unified-signatures': 'off',
  
      // Activer uniquement la règle de convention de nommage pour les variables
      '@typescript-eslint/naming-convention': [
        'warn', // Mettre en warning
        {
          selector: 'variable', // Appliquer uniquement aux variables
          format: ['camelCase'], // Exiger camelCase
        },
      ],
    },
  };