import React from 'react';

import {clsx} from 'clsx';

// A solved 10x5 nonogram that draws `</>` — the hero illustration.
const rows = ['0010010100', '0100010010', '1000110001', '0100100010', '0010100100'];

function clue(bits: string[]): number[] {
    const runs = bits
        .join('')
        .split('0')
        .filter(Boolean)
        .map((run) => run.length);
    return runs.length ? runs : [0];
}

type Cell = {text: string; filled?: boolean; clue?: boolean};

function buildCells(): Cell[] {
    const cells: Cell[] = [{text: '', clue: true}];
    for (let x = 0; x < rows[0].length; x++) {
        cells.push({text: clue(rows.map((row) => row[x])).join('\n'), clue: true});
    }
    for (const row of rows) {
        cells.push({text: clue(row.split('')).join(' '), clue: true});
        for (const bit of row) {
            cells.push({text: '', filled: bit === '1'});
        }
    }
    return cells;
}

type Props = {
    label: string;
    status: string;
    alt: string;
    caption?: string;
};

export function SolverPanel({label, status, alt, caption}: Props) {
    return (
        <div className="min-w-0 flex-[2_1_360px] overflow-hidden rounded-[10px] border border-line bg-panel">
            <div className="flex justify-between gap-4 border-b border-line px-4 py-3 font-term text-xs text-muted">
                <span>{label}</span>
                <span className="text-accent">{status}</span>
            </div>
            <span className="sr-only">{alt}</span>
            <div aria-hidden="true" className="grid grid-cols-11 gap-[3px] p-5">
                {buildCells().map((cell, index) => (
                    <div
                        key={index}
                        className={clsx(
                            'flex aspect-square items-end justify-center rounded-xs text-center font-term text-[11px] leading-[1.15] whitespace-pre-line text-muted',
                            !cell.clue && (cell.filled ? 'bg-accent' : 'bg-cell'),
                        )}
                    >
                        {cell.text}
                    </div>
                ))}
            </div>
            {caption && (
                <p className="m-0 border-t border-line px-4 py-3 font-term text-xs text-muted">
                    {caption}
                </p>
            )}
        </div>
    );
}
