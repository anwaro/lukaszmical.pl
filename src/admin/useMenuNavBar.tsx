import React, {useMemo} from 'react';

import {
    mdiAccount,
    mdiCogOutline,
    mdiEmail,
    mdiLogout,
    mdiThemeLightDark,
} from '@mdi/js';

import UserAvatarCurrentUser from '@/admin/components/UserAvatar/CurrentUser';
import {useDarkMode} from '@/admin/stores/dark-mode';

import {MenuNavBarItem} from './interfaces';

export function useMenuNavBare() {
    const {toggleDarkMode} = useDarkMode();
    return useMemo(
        (): MenuNavBarItem[] => [
            {
                label: 'Lukasz M',
                icon: <UserAvatarCurrentUser className="mr-3 inline-flex size-6" />,
                menu: [
                    {
                        icon: mdiAccount,
                        label: 'My Profile',
                        href: '/profile',
                    },
                    {
                        icon: mdiCogOutline,
                        label: 'Settings',
                    },
                    {
                        icon: mdiEmail,
                        label: 'Messages',
                    },
                    {
                        isDivider: true,
                    },
                    {
                        icon: mdiLogout,
                        label: 'Log Out',
                        href: '/admin/auth/logout',
                    },
                ],
            },
            {
                icon: mdiThemeLightDark,
                label: 'Light/Dark',
                isDesktopNoLabel: true,
                onClick: toggleDarkMode,
            },
            {
                icon: mdiLogout,
                label: 'Log out',
                isDesktopNoLabel: true,
                href: '/admin/auth/logout',
            },
        ],
        [toggleDarkMode],
    );
}
