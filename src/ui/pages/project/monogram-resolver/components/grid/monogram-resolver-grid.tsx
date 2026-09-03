'use client';

import React from 'react';

import {clsx} from 'clsx';

import {GroupModel} from '@/services/projects/monogram-resolver/model/model-group';
import {
    CellModel,
    CellStatus,
} from '@/services/projects/monogram-resolver/model/model-cell';
import {CellHelper} from '@/services/projects/monogram-resolver/helper/helper-cell';
import {usePageMonogramResolverGrid} from '@/ui/pages/project/monogram-resolver/components/grid/monogram-resolver-grid.hook';
import {PageMonogramResolverLoop} from '@/ui/pages/project/monogram-resolver/components/grid/monogram-resolver-loop';
import {PageMonogramResolverCopyGroup} from '@/ui/pages/project/monogram-resolver/components/grid/monogram-resolver-copy-group';
import {PageMonogramResolverBox} from '@/ui/pages/project/monogram-resolver/components/monogram-resolver-box';

type Props = {
    groups: GroupModel[];
    cells: CellModel[];
};

export function PageMonogramResolverGrid({groups, cells}: Props) {
    const {
        resolved,
        cellsWithStatus,
        columns,
        rows,
        loop,
        setLoop,
        groupStatus,
        copyGroupValues,
    } = usePageMonogramResolverGrid({groups, cells});
    const cellClasses = {
        included: 'bg-indigo-800 border-indigo-800',
        excluded: 'text-white border border-stone-800',
        unknown: 'border border-stone-800',
    };

    const groupStatuClasses = {
        solved: 'text-green-800',
        unsolved: 'text-white-800',
    };

    const addBorder = (index: number, className: string) => {
        return index !== 0 && index != columns.length - 1 && (index + 1) % 5 === 0
            ? className
            : '';
    };

    return (
        <PageMonogramResolverBox
            title={`GRID (${resolved}/${cells.length})`}
            hidden
            useOpacity
            middle={
                <PageMonogramResolverLoop
                    loop={loop}
                    setLoop={setLoop}
                    cells={cells}
                />
            }
        >
            <table>
                <tbody>
                    <tr className={'align-bottom'}>
                        <td />
                        {columns.map((group) => (
                            <td key={group.id}>
                                <div
                                    onClick={() => copyGroupValues(group)}
                                    className={`flex flex-col justify-end ${groupStatuClasses[groupStatus(group)]}`}
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
                                    <div className="-mb-1 flex w-6 justify-center text-[9px] text-stone-400">
                                        {group.id.replace('COL-', '')}
                                    </div>
                                </div>
                            </td>
                        ))}
                        <td />
                    </tr>
                    {rows.map((group, rowIndex) => (
                        <tr key={group.id}>
                            <td
                                onClick={() => copyGroupValues(group)}
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
                                <div className="-mr-1 ml-1 flex h-6 items-center justify-end text-[9px] text-stone-400">
                                    {group.id.replace('ROW-', '')}
                                </div>
                            </td>

                            {group.cells(cellsWithStatus).map((cell, index) => (
                                <td
                                    key={cell.id}
                                    className={clsx(
                                        addBorder(
                                            index,
                                            'border-r border-stone-600',
                                        ),
                                        addBorder(
                                            rowIndex,
                                            'border-b border-stone-600',
                                        ),
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            'flex size-6 items-center justify-center rounded',
                                            cellClasses[cell.status],
                                        )}
                                        title={CellHelper.title(cell)}
                                    >
                                        {cell.status === CellStatus.excluded && (
                                            <div>x</div>
                                        )}
                                    </div>
                                </td>
                            ))}
                            <td>
                                <PageMonogramResolverCopyGroup
                                    group={group}
                                    cells={cellsWithStatus}
                                    row
                                />
                            </td>
                        </tr>
                    ))}

                    <tr className={'align-bottom'}>
                        <td />
                        {columns.map((group, index) => (
                            <td key={group.id}>
                                <PageMonogramResolverCopyGroup
                                    group={group}
                                    cells={cellsWithStatus}
                                />
                            </td>
                        ))}
                        <td />
                    </tr>
                </tbody>
            </table>
        </PageMonogramResolverBox>
    );
}
