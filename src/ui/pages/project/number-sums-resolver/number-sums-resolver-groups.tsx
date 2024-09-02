'use client';

import React, {useCallback} from 'react';

import {clsx} from 'clsx';

import {
    GroupModel,
    GroupType,
} from '@/services/projects/number-sums-resolver/model/model-group';
import {CellModel} from '@/services/projects/number-sums-resolver/model/model-cell';
import {CellHelper} from '@/services/projects/number-sums-resolver/helper/helper-cell';

type Props = {
    groups: GroupModel[];
    cells: CellModel[];
};

export function PageNumberSumsResolverGroups({groups, cells}: Props) {
    const cellClasses = {
        error: 'text-red-700 border-red-700',
        included: 'text-green-600 border-green-600',
        excluded: 'text-stone-800 border-stone-800',
        unknown: 'text-white border-white',
    };

    const isFirst = useCallback(
        (group: GroupModel) => {
            return [
                groups.find((g) => g.type === GroupType.color)?.id,
                groups.find((g) => g.type === GroupType.row)?.id,
                groups.find((g) => g.type === GroupType.column)?.id,
            ].includes(group.id);
        },
        [groups],
    );

    return (
        <div className="flex flex-col gap-2">
            {groups.map((group) => (
                <div
                    className={`flex gap-1 ${isFirst(group) ? 'mt-1 border-t border-dashed pt-2' : ''}`}
                    key={group.id}
                >
                    <div className={'flex items-center'} style={{width: 50}}>
                        {group.type === GroupType.color ? (
                            <div
                                className={'size-5 rounded'}
                                style={{background: group.color}}
                            />
                        ) : (
                            group.id
                        )}
                    </div>
                    <div
                        className={
                            'border-right flex w-10 items-center justify-end border-dashed px-1'
                        }
                    >
                        {group.sum}
                    </div>
                    <div className={'flex gap-1'}>
                        {group.cells(cells).map((cell) => (
                            <div
                                className={clsx(
                                    'flex size-6 items-center justify-center rounded border',
                                    cellClasses[
                                        cell.value === 0 ? 'error' : cell.status
                                    ],
                                )}
                                key={cell.id}
                                title={CellHelper.title(cell)}
                            >
                                {cell.value}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
