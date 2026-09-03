'use client';

import React, {useEffect, useMemo, useState} from 'react';

import {CellModel} from '@/services/projects/monogram-resolver/model/model-cell';

type Props = {
    setLoop: (loop: number) => void;
    cells: CellModel[];
    loop: number;
};

export function PageMonogramResolverLoop({setLoop, cells, loop}: Props) {
    const [manual, setManual] = useState(false);
    const maxLoop = useMemo(
        () => Math.max(0, ...cells.map((c) => c.loop || 0)),
        [cells],
    );

    useEffect(() => {
        if (!manual) {
            setLoop(maxLoop);
        }
    }, [maxLoop, manual]);

    useEffect(() => {
        if (cells.length === 0) {
            // Reset to auto-follow when the grid is cleared (external data
            // change), then let effect 1 resync the loop value.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setManual(false);
            setLoop(0);
        }
    }, [cells.length]);

    return (
        <div className={'flex gap-2'}>
            <span>{loop}</span>
            <input
                className={'w-50'}
                type={'range'}
                max={maxLoop}
                value={loop}
                step={1}
                onChange={(e) => {
                    setManual(true);
                    setLoop(Number(e.target.value));
                }}
            />
            <span>{maxLoop}</span>
        </div>
    );
}
