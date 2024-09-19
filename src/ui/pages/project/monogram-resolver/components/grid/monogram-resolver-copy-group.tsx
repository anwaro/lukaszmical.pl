'use client';

import React, {useCallback} from 'react';

import {CellModel} from '@/services/projects/monogram-resolver/model/model-cell';
import {GroupModel} from '@/services/projects/monogram-resolver/model/model-group';
import {CellHelper} from '@/services/projects/monogram-resolver/helper/helper-cell';

type Props = {
    cells: CellModel[];
    group: GroupModel;
    row?: boolean;
};

export function PageMonogramResolverCopyGroup({group, cells, row}: Props) {
    const copyGroup = useCallback(
        (group: GroupModel) => {
            navigator.clipboard.writeText(CellHelper.toPattern(group.cells(cells)));
        },
        [cells, cells],
    );

    return (
        <div
            className={
                'flex size-6 cursor-pointer justify-center rounded bg-cyan-900 text-white'
            }
            onClick={() => copyGroup(group)}
        >
            {row ? '←' : '↑'}
        </div>
    );
}
