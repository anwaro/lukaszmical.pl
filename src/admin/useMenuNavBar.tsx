import {
    mdiAccount,
    mdiCogOutline,
    mdiEmail,
    mdiLogout,
    mdiThemeLightDark,
} from '@mdi/js';
import {MenuNavBarItem} from './interfaces';

import React, {useMemo} from 'react';
import UserAvatarCurrentUser from '@/admin/components/UserAvatar/CurrentUser';
import {useDarkMode} from '@/admin/stores/dark-mode';

export function useMenuNavBare() {
    const {toggleDarkMode} = useDarkMode();
    return useMemo(
        (): MenuNavBarItem[] => [
            {
                label: 'Lukasz M',
                icon: <UserAvatarCurrentUser className="w-6 h-6 mr-3 inline-flex" />,
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
