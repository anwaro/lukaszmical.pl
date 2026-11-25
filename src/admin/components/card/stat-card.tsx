import React, {ReactNode} from 'react';

import {clsx} from 'clsx';

type Props = {
    label: string;
    value: ReactNode;
    meta?: ReactNode;
    className?: string;
};

// A statistic tile: micro label and a tabular number.
export function StatCard({label, value, meta, className}: Props) {
    return (
        <div className={clsx('kv-card kv-stat', className)}>
            <p className="kv-stat-label">{label}</p>
            <p className="kv-stat-value">{value}</p>
            {meta && <p className="kv-stat-meta">{meta}</p>}
        </div>
    );
}
