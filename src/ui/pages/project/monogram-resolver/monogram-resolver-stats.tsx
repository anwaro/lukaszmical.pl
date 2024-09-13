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
        <div className="flex flex-col gap-2">
            <div className={'mt-1 flex flex-col gap-1 border-t border-dashed pt-2'}>
                {stats.map(([name, count]) => (
                    <div className={`flex`} key={name}>
                        {name.replace(/[A-Z]/g, (d) => ` ${d}`)} ({count})
                    </div>
                ))}
            </div>
        </div>
    );
}
