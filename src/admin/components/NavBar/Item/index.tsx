import React, {useState} from 'react';

import Link from 'next/link';
import {mdiChevronDown, mdiChevronUp} from '@mdi/js';
import {clsx} from 'clsx';

import Divider from '../../divider';
import {Icon} from '../../icon/icon';
import {MenuNavBarItem} from '../../../interfaces';

type Props = {
    item: MenuNavBarItem;
};

export default function NavBarItem({item}: Props) {
    const [isDropdownActive, setIsDropdownActive] = useState(false);

    const componentClass = clsx(
        'relative block cursor-pointer items-center lg:flex',
        isDropdownActive
            ? `navbar-item-label-active text-slate-400`
            : `navbar-item-label text-white hover:text-slate-400`,
        item.menu ? 'lg:px-3 lg:py-2' : 'px-3 py-2',
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
                    item.menu && 'bg-slate-800 p-3 lg:bg-transparent lg:p-0',
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
                        className="hidden transition-colors lg:inline-flex"
                    />
                )}
            </div>
            {item.menu && (
                <div
                    className={clsx(
                        !isDropdownActive && 'lg:hidden',
                        'border-b border-slate-700 text-sm lg:absolute lg:left-0 lg:top-full lg:z-20 lg:min-w-full lg:rounded-lg lg:border lg:bg-slate-800 lg:shadow-lg',
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
