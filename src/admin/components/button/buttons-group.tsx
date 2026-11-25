import type {ReactNode} from 'react';

import {clsx} from 'clsx';

type Props = {
    align?: 'start' | 'end';
    noWrap?: boolean;
    className?: string;
    children: ReactNode;
};

export const ButtonsGroup = ({
    align = 'start',
    noWrap = false,
    className,
    children,
}: Props) => {
    return (
        <div
            className={clsx(
                'flex items-center gap-2',
                align === 'end' ? 'justify-end' : 'justify-start',
                noWrap ? 'flex-nowrap' : 'flex-wrap',
                className,
            )}
        >
            {children}
        </div>
    );
};

export default ButtonsGroup;
