'use client';

import React, {useCallback} from 'react';

import {clsx} from 'clsx';

import {
    GroupModel,
    GroupType,
} from '@/services/projects/monogram-resolver/model/model-group';
import {
    CellModel,
    CellStatus,
} from '@/services/projects/monogram-resolver/model/model-cell';
import {CellHelper} from '@/services/projects/monogram-resolver/helper/helper-cell';

type Props = {
    groups: GroupModel[];
    cells: CellModel[];
};

export function PageMonogramResolverGroups({groups, cells}: Props) {
    const cellClasses = {
        included: 'bg-indigo-800 border-indigo-800',
        excluded: 'text-white border border-stone-800',
        unknown: 'border border-stone-800',
    };

    const groupStatuClasses = {
        solved: 'text-green-800',
        unsolved: 'text-white-800',
    };

    const columns = groups.filter((g) => g.type === GroupType.column);
    const rows = groups.filter((g) => g.type === GroupType.row);

    const groupStatus = (group: GroupModel) => {
        return group.unknownCells(cells).length === 0 ? 'solved' : 'unsolved';
    };

    return (
        <div className="flex flex-col gap-2">
            <div className={'mt-1 flex gap-1 border-t border-dashed pt-2'}>
                <div
                    className={
                        'border-right flex w-40 items-center justify-end border-dashed px-1'
                    }
                ></div>
                <div className={'flex gap-1'}>
                    {columns.map((group) => (
                        <div
                            className={`flex flex-col justify-end ${groupStatuClasses[groupStatus(group)]}`}
                            key={group.id}
                        >
                            <div className={'size-6'}></div>
                            {group.values.map((v, i) => (
                                <div
                                    className="flex size-6 items-center justify-center"
                                    key={i}
                                >
                                    {v}
                                </div>
                            ))}
                            <div className="-mb-2 mt-1 flex w-6 justify-center text-[8px] text-stone-400">
                                {group.id.replace('COL-', '')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {rows.map((group) => (
                <div className={'flex gap-1'} key={group.id}>
                    <div
                        className={`border-right flex w-40 items-center justify-end px-1 ${groupStatuClasses[groupStatus(group)]}`}
                    >
                        {group.values.map((v, i) => (
                            <div
                                className="flex size-6 items-center justify-center"
                                key={i}
                            >
                                {v}
                            </div>
                        ))}
                        <div className="-mr-2 ml-1 flex h-6 w-[10px] items-center justify-end text-[8px] text-stone-400">
                            {group.id.replace('ROW-', '')}
                        </div>
                    </div>
                    <div className={'flex gap-1'}>
                        {group.cells(cells).map((cell) => (
                            <div
                                className={clsx(
                                    'flex size-6 items-center justify-center rounded',
                                    cellClasses[cell.status],
                                )}
                                key={cell.id}
                                title={CellHelper.title(cell)}
                            >
                                {cell.status === CellStatus.excluded && <div>x</div>}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
