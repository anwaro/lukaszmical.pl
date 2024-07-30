import {useMemo} from 'react';

import {mdiCodeJson, mdiMonitor, mdiViewList} from '@mdi/js';

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
                label: 'Projects',
                icon: mdiCodeJson,
                href: '/admin/projects',
                menu: examples.map((item) => ({
                    label: item,
                    href: `/admin/examples/${item}`,
                })),
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
