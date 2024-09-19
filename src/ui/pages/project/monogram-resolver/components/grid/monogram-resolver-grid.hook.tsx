'use client';

import {useCallback, useMemo, useState} from 'react';

import {
    GroupModel,
    GroupType,
} from '@/services/projects/monogram-resolver/model/model-group';
import {
    CellModel,
    CellStatus,
} from '@/services/projects/monogram-resolver/model/model-cell';

type Props = {
    groups: GroupModel[];
    cells: CellModel[];
};

export function usePageMonogramResolverGrid({groups, cells}: Props) {
    const columns = groups.filter((g) => g.type === GroupType.column);
    const rows = groups.filter((g) => g.type === GroupType.row);
    const resolved = cells.filter((c) => c.status !== CellStatus.unknown).length;
    const [loop, setLoop] = useState(0);

    const groupStatus = (group: GroupModel) => {
        return group.unknownCells(cells).length === 0 ? 'solved' : 'unsolved';
    };

    const status = useCallback(
        (cell: CellModel) => {
            if (cell.loop && cell.loop <= loop) {
                return cell.status;
            }
            return CellStatus.unknown;
        },
        [loop],
    );

    const cellsWithStatus = useMemo(() => {
        return cells.map((cell) => cell.copy(status(cell)));
    }, [cells, status]);

    return {
        resolved,
        columns,
        rows,
        cells,
        cellsWithStatus,
        loop,
        setLoop,
        groupStatus,
    };
}
