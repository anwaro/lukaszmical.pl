'use client';

import React, {ReactNode, useState} from 'react';

type Props = PWC<{
    title: string;
    toggleEnable?: boolean;
    hidden?: boolean;
    useOpacity?: boolean;
    middle?: ReactNode;
}>;

export function PageMonogramResolverBox({
    title,
    hidden,
    middle,
    useOpacity,
    children,
}: Props) {
    const [visible, setVisible] = useState(!hidden);

    return (
        <div className="rounded border border-white p-4">
            <div className={'flex justify-between'}>
                <pre>{title}</pre>
                {middle}
                {hidden && (
                    <input
                        type="checkbox"
                        value={visible ? 'true' : ''}
                        onChange={(e) => setVisible(e.target.checked)}
                    />
                )}
            </div>
            <div className={'mt-2 flex border-t border-dashed pb-2'} />
            <div className={visible ? '' : useOpacity ? 'opacity-10' : 'hidden'}>
                {children}
            </div>
        </div>
    );
}
