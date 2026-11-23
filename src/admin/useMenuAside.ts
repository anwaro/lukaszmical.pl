import {useMemo} from 'react';

import {
    mdiBookOpenPageVariant,
    mdiCodeJson,
    mdiHome,
    mdiMonitor,
    mdiTranslate,
    mdiViewList,
} from '@mdi/js';

import {MenuAsideItem} from './interfaces';

const examples = ['dashboard', 'error', 'forms', 'login', 'profile', 'tables', 'ui'];

export function useMenuAside() {
    return useMemo(
        (): MenuAsideItem[] => [
            {
                href: '/admin',
                icon: mdiMonitor,
                label: 'Dashboard',
            },
            {
                href: '/admin/homepage',
                icon: mdiHome,
                label: 'Homepage',
            },
            {
                href: '/admin/case-studies',
                icon: mdiBookOpenPageVariant,
                label: 'Case studies',
            },
            {
                href: '/admin/projects',
                icon: mdiCodeJson,
                label: 'Projects',
            },
            {
                href: '/admin/translations',
                icon: mdiTranslate,
                label: 'Translations',
            },
            {
                label: 'Example',
                icon: mdiViewList,
                menu: examples.map((item) => ({
                    label: item,
                    href: `/admin/examples/${item}`,
                })),
            },
        ],
        [],
    );
}
