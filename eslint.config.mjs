import next from 'eslint-config-next';
import tailwindcss from 'eslint-plugin-tailwindcss';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'server/**',
            'scripts/**',
            'public/**',
            'next-env.d.ts',
        ],
    },
    ...next,
    tailwindcss.configs.recommended,
    {
        settings: {
            tailwindcss: {
                cssConfigPath: 'src/app/globals.css',
            },
        },
    },
    {
        rules: {
            'import/order': [
                'error',
                {
                    groups: [
                        'type',
                        'object',
                        'builtin',
                        'external',
                        'internal',
                        ['parent', 'sibling'],
                        'index',
                    ],
                    pathGroups: [
                        {
                            pattern: 'react',
                            group: 'builtin',
                            position: 'before',
                        },
                        {
                            pattern: '@/*/**',
                            group: 'internal',
                            position: 'before',
                        },
                    ],
                    'newlines-between': 'always',
                    pathGroupsExcludedImportTypes: ['react'],
                    warnOnUnassignedImports: true,
                },
            ],
        },
    },
];
