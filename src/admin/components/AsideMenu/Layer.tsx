import React from 'react';

import {mdiClose, mdiLogout} from '@mdi/js';

import {useDarkMode} from '@/admin/stores/dark-mode';

import Icon from '../Icon';
import AsideMenuItem from './Item';
import AsideMenuList from './List';
import {MenuAsideItem} from '../../interfaces';

type Props = {
    menu: MenuAsideItem[];
    className?: string;
    onAsideLgCloseClick: () => void;
};

export default function AsideMenuLayer({menu, className = '', ...props}: Props) {
    const {darkModeEnabled} = useDarkMode();

    const logoutItem: MenuAsideItem = {
        label: 'Logout',
        icon: mdiLogout,
        color: 'info',
        href: '/admin/auth/logout',
    };

    const handleAsideLgCloseClick = (e: React.MouseEvent) => {
        e.preventDefault();
        props.onAsideLgCloseClick();
    };

    return (
        <aside
            className={`${className} zzz fixed top-0 z-40 flex h-screen w-60 overflow-hidden transition-position lg:py-2 lg:pl-2`}
        >
            <div
                className={`aside flex flex-1 flex-col overflow-hidden dark:bg-slate-900 lg:rounded-2xl`}
            >
                <div
                    className={`aside-brand flex h-14 flex-row items-center justify-between dark:bg-slate-900`}
                >
                    <div className="flex-1 text-center lg:pl-6 lg:text-left xl:pl-0 xl:text-center">
                        <b className="font-black">One</b>
                    </div>
                    <button
                        className="hidden p-3 lg:inline-block xl:hidden"
                        onClick={handleAsideLgCloseClick}
                    >
                        <Icon path={mdiClose} />
                    </button>
                </div>
                <div
                    className={`flex-1 overflow-y-auto overflow-x-hidden ${
                        darkModeEnabled
                            ? 'aside-scrollbars-[slate]'
                            : 'aside-scrollbars'
                    }`}
                >
                    <AsideMenuList menu={menu} />
                </div>
                <ul>
                    <AsideMenuItem item={logoutItem} />
                </ul>
            </div>
        </aside>
    );
}
