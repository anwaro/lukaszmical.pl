import React, {useState} from 'react';
import Link from 'next/link';
import {mdiChevronDown, mdiChevronUp} from '@mdi/js';
import Divider from '../../Divider';
import Icon from '../../Icon';
import {MenuNavBarItem} from '../../../interfaces';
import {clsx} from 'clsx';

type Props = {
    item: MenuNavBarItem;
};

export default function NavBarItem({item}: Props) {
    const [isDropdownActive, setIsDropdownActive] = useState(false);

    const componentClass = clsx(
        'block lg:flex items-center relative cursor-pointer',
        isDropdownActive
            ? `navbar-item-label-active dark:text-slate-400`
            : `navbar-item-label dark:text-white dark:hover:text-slate-400`,
        item.menu ? 'lg:py-2 lg:px-3' : 'py-2 px-3',
        item.isDesktopNoLabel && 'lg:w-16 lg:justify-center',
    );

    const handleMenuClick = () => {
        if (item.menu) {
            setIsDropdownActive(!isDropdownActive);
        }

        if (item.onClick) {
            item.onClick();
        }
    };

    const NavBarItemComponentContents = (
        <>
            <div
                className={clsx(
                    'flex items-center',
                    item.menu &&
                        'bg-gray-100 dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-3 lg:p-0',
                )}
                onClick={handleMenuClick}
            >
                {typeof item.icon === 'string' ? (
                    <Icon path={item.icon} className="transition-colors" />
                ) : (
                    item.icon
                )}
                <span
                    className={clsx(
                        'px-2 transition-colors',
                        item.isDesktopNoLabel && item.icon && 'lg:hidden',
                    )}
                >
                    {item.label}
                </span>
                {item.menu && (
                    <Icon
                        path={isDropdownActive ? mdiChevronUp : mdiChevronDown}
                        className="hidden lg:inline-flex transition-colors"
                    />
                )}
            </div>
            {item.menu && (
                <div
                    className={clsx(
                        !isDropdownActive && 'lg:hidden',
                        'text-sm border-b border-gray-100 lg:border lg:bg-white lg:absolute lg:top-full lg:left-0 lg:min-w-full lg:z-20 lg:rounded-lg lg:shadow-lg lg:dark:bg-slate-800 dark:border-slate-700',
                    )}
                >
                    {item.menu.map((item, index) => (
                        <NavBarItem key={index} item={item} />
                    ))}
                </div>
            )}
        </>
    );

    if (item.isDivider) {
        return <Divider navBar />;
    }

    if (item.href) {
        return (
            <Link href={item.href} className={componentClass}>
                {NavBarItemComponentContents}
            </Link>
        );
    }

    return <div className={componentClass}>{NavBarItemComponentContents}</div>;
}
