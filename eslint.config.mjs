/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'import'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'next/core-web-vitals',
        'plugin:prettier/recommended',
        'prettier',
    ],
    settings: {
        react: {
            version: 'detect',
        },
        next: {
            rootDir: true,
        },
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'react/react-in-jsx-scope': 'off',
        'prettier/prettier': 0,
        'import/order': [
            'warn',
            {
                groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                pathGroups: [
                    {
                        pattern: 'react',
                        group: 'external',
                        position: 'before',
                    },
                ],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                pathGroupsExcludedImportTypes: ['react'],
            },
        ],
    },
};
