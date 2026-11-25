import React, {ButtonHTMLAttributes} from 'react';

import Link from 'next/link';
import {clsx} from 'clsx';
import {LoaderCircle, LucideIcon} from 'lucide-react';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    icon: LucideIcon;
    // Required: the accessible name (aria-label and title) of the icon.
    label: string;
    // danger: the hover turns rose — for removing actions.
    tone?: 'default' | 'danger';
    loading?: boolean;
    href?: string;
    target?: string;
};

// A square 36px button with an icon only.
export function IconButton({
    icon,
    label,
    tone = 'default',
    loading = false,
    href,
    target,
    className,
    type = 'button',
    ...props
}: Props) {
    const Icon = loading ? LoaderCircle : icon;
    const classes = clsx(
        'kv-icon-btn',
        tone === 'danger' && 'kv-icon-btn-danger',
        className,
    );
    const content = (
        <Icon
            className={clsx('kv-icon', loading && 'kv-spin')}
            strokeWidth={1.8}
            aria-hidden
        />
    );

    if (href) {
        return (
            <Link
                href={href}
                target={target}
                className={classes}
                aria-label={label}
                title={label}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            aria-label={label}
            title={label}
            {...props}
        >
            {content}
        </button>
    );
}
