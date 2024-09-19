'use client';

import React, {useMemo} from 'react';

import {CellModel} from '@/services/projects/monogram-resolver/model/model-cell';

type Props = {
    cells: CellModel[];
};

export function PageMonogramResolverStats({cells}: Props) {
    const stats = useMemo(() => {
        const statsObject = cells.reduce(
            (acc, cell) => {
                if (!cell.resolver) {
                    return acc;
                }
                if (cell.resolver in acc) {
                    acc[cell.resolver] += 1;
                } else {
                    acc[cell.resolver] = 1;
                }
                return acc;
            },
            {} as Record<string, number>,
        );

        return Object.entries(statsObject).sort((a, b) => Math.sign(b[1] - a[1]));
    }, [cells]);

    return (
        <div className={'flex flex-col gap-1'}>
            {stats.map(([name, count], index) => (
                <div className={`flex`} key={name}>
                    {index + 1}. {name.replace(/[A-Z]/g, (d) => ` ${d}`)} ({count})
                </div>
            ))}
        </div>
    );
}
