import React, {ReactNode} from 'react';

import {clsx} from 'clsx';

import {cardClassName} from './card-model';

type Props = {
    label: string;
    value: ReactNode;
    meta?: ReactNode;
    className?: string;
};

// A statistic tile: micro label and a tabular number.
export function StatCard({label, value, meta, className}: Props) {
    return (
        <div className={clsx(cardClassName('md', className), 'min-w-0 px-4 py-3')}>
            <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                {label}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-slate-900 dark:text-white truncate">
                {value}
            </p>
            {meta && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {meta}
                </p>
            )}
        </div>
    );
}
