'use client';

import React, {ReactNode, useEffect, useState} from 'react';

import {mdiBackburger, mdiForwardburger, mdiMenu} from '@mdi/js';
import {useRouter} from 'next/navigation';
import {clsx} from 'clsx';

import {FormField} from '@/admin/components/form/form-field';

import {useMenuAside} from '../useMenuAside';
import {useMenuNavBare} from '../useMenuNavBar';
import Icon from '../components/Icon';
import NavBar from '../components/NavBar';
import NavBarItemPlain from '../components/NavBar/Item/Plain';
import AsideMenu from '../components/AsideMenu';

type Props = {
    children: ReactNode;
};

export default function LayoutAuthenticated({children}: Props) {
    const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false);
    const [isAsideLgActive, setIsAsideLgActive] = useState(false);
    const menuAside = useMenuAside();
    const menuNavBar = useMenuNavBare();
    const router = useRouter();

    useEffect(() => {
        const handleRouteChangeStart = () => {
            setIsAsideMobileExpanded(false);
            setIsAsideLgActive(false);
        };

        // router.events.on('routeChangeStart', handleRouteChangeStart);

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            // router.events.off('routeChangeStart', handleRouteChangeStart);
        };
    }, [router]);

    const layoutAsidePadding = 'xl:pl-60';

    return (
        <div className={`overflow-hidden lg:overflow-visible`}>
            <div
                className={clsx(
                    layoutAsidePadding,
                    isAsideMobileExpanded && 'ml-60 lg:ml-0',
                    'min-h-screen w-screen pt-14 transition-position lg:w-auto',
                    'bg-gray-50 dark:bg-slate-800 dark:text-slate-100',
                )}
            >
                <NavBar
                    menu={menuNavBar}
                    className={clsx(
                        layoutAsidePadding,
                        isAsideMobileExpanded && 'ml-60 lg:ml-0',
                    )}
                >
                    <NavBarItemPlain
                        display="flex lg:hidden"
                        onClick={() =>
                            setIsAsideMobileExpanded(!isAsideMobileExpanded)
                        }
                    >
                        <Icon
                            path={
                                isAsideMobileExpanded
                                    ? mdiBackburger
                                    : mdiForwardburger
                            }
                            size="24"
                        />
                    </NavBarItemPlain>
                    <NavBarItemPlain
                        display="hidden lg:flex xl:hidden"
                        onClick={() => setIsAsideLgActive(true)}
                    >
                        <Icon path={mdiMenu} size="24" />
                    </NavBarItemPlain>
                    <NavBarItemPlain useMargin>
                        <form>
                            <FormField isBorderless isTransparent>
                                <input name="search" placeholder="Search" />
                            </FormField>
                        </form>
                    </NavBarItemPlain>
                </NavBar>
                <AsideMenu
                    isAsideMobileExpanded={isAsideMobileExpanded}
                    isAsideLgActive={isAsideLgActive}
                    menu={menuAside}
                    onAsideLgClose={() => setIsAsideLgActive(false)}
                />
                {children}
            </div>
        </div>
    );
}
