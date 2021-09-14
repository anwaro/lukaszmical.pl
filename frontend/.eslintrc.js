module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        jest: true,
    },
    parser: '@typescript-eslint/parser',
    extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
    plugins: [
        '@typescript-eslint',
        'prettier',
        'react',
        'import',
        'eslint-plugin-node',
    ],
    ignorePatterns: ['./src/typings', './next', './node_modules', './projects'],
    rules: {
        'no-eval': 'error',
        'import/first': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],
        'react/prop-types': 'off',
        'no-console': [
            'error',
            {
                allow: ['warn', 'error'],
            },
        ],
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    ['internal', 'unknown'],
                    'parent',
                    ['sibling', 'index'],
                ],
                'newlines-between': 'always',
            },
        ],
    },
};
