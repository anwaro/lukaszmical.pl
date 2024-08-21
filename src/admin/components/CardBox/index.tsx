import React, {ReactNode} from 'react';

import {clsx} from 'clsx';

import CardBoxComponentBody from './Component/Body';
import CardBoxComponentFooter from './Component/Footer';

type Props = {
    rounded?: string;
    flex?: string;
    className?: string;
    hasComponentLayout?: boolean;
    hasTable?: boolean;
    isHoverable?: boolean;
    isModal?: boolean;
    children: ReactNode;
    footer?: ReactNode;
    onClick?: (e: React.MouseEvent) => void;
};

export default function CardBox({
    rounded = 'rounded-2xl',
    flex = 'flex-col',
    className = '',
    hasComponentLayout = false,
    hasTable = false,
    isHoverable = false,
    isModal = false,
    children,
    footer,
    onClick,
}: Props) {
    const componentClass = [
        'flex',
        className,
        rounded,
        flex,
        isModal ? 'bg-slate-900' : 'bg-slate-900/70',
    ];

    if (isHoverable) {
        componentClass.push('hover:shadow-lg transition-shadow duration-500');
    }

    return React.createElement(
        'div',
        {className: clsx(componentClass), onClick},
        hasComponentLayout ? (
            children
        ) : (
            <>
                <CardBoxComponentBody noPadding={hasTable}>
                    {children}
                </CardBoxComponentBody>
                {footer && <CardBoxComponentFooter>{footer}</CardBoxComponentFooter>}
            </>
        ),
    );
}
