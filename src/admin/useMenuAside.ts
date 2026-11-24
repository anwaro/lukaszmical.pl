import {useMemo} from 'react';

import {
    mdiBookOpenPageVariant,
    mdiCodeJson,
    mdiFileDocumentMultiple,
    mdiHome,
    mdiTranslate,
} from '@mdi/js';

import {MenuAsideItem} from './interfaces';

export function useMenuAside() {
    return useMemo(
        (): MenuAsideItem[] => [
            {
                href: '/admin/homepage',
                icon: mdiHome,
                label: 'Homepage',
            },
            {
                href: '/admin/pages',
                icon: mdiFileDocumentMultiple,
                label: 'Pages',
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
        ],
        [],
    );
}
