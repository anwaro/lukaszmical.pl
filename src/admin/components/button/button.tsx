import React, {ButtonHTMLAttributes} from 'react';

import Link from 'next/link';
import {clsx} from 'clsx';
import {LoaderCircle, LucideIcon} from 'lucide-react';

import {ButtonVariant, buttonClassName} from './button-model';

export type {ButtonVariant};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    // primary: the one main action of a view; secondary: cancel and the rest;
    // danger: a destructive action, only as a confirmation.
    variant?: ButtonVariant;
    // sm: in toolbars, modals and dense rows.
    size?: 'md' | 'sm';
    icon?: LucideIcon;
    loading?: boolean;
    // Renders a link styled as a button.
    href?: string;
    target?: string;
};

export function Button({
    variant = 'primary',
    size = 'md',
    icon: IconComponent,
    loading = false,
    href,
    target,
    className,
    children,
    type = 'button',
    ...props
}: ButtonProps) {
    const classes = buttonClassName(variant, size, className);
    const Icon = loading ? LoaderCircle : IconComponent;
    const content = (
        <>
            {Icon && (
                <Icon
                    className={clsx('size-4 shrink-0', loading && 'animate-spin')}
                    strokeWidth={1.8}
                    aria-hidden
                />
            )}
            {children}
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                target={target}
                className={classes}
                title={props.title}
            >
                {content}
            </Link>
        );
    }

    return (
        <button type={type} className={classes} {...props}>
            {content}
        </button>
    );
}
