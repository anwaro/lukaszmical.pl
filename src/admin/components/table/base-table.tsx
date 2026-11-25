'use client';

import React, {ReactNode, useMemo, useState} from 'react';

import {clsx} from 'clsx';

import {Button} from '../button/button';

type Column = {
    label: ReactNode;
    // Tabular numbers, right aligned.
    numeric?: boolean;
    // The main column of a row: ink, medium weight.
    strong?: boolean;
    align?: 'start' | 'end';
};

type Props<Item, Key extends string> = {
    data: Item[];
    itemId: (item: Item) => string;
    // A column set to undefined is left out.
    columns: Partial<Record<Key, Column>>;
    renderData: Partial<Record<Key, (object: Item) => ReactNode>>;
    limit?: number;
    empty?: ReactNode;
};

// A table for a flush card: micro-label header, rows split by border-subtle,
// scrolls sideways on narrow screens.
export function BaseTable<Item extends object, Key extends string>({
    data,
    limit = 20,
    renderData,
    columns,
    itemId,
    empty = 'Brak pozycji.',
}: Props<Item, Key>) {
    const [currentPage, setCurrentPage] = useState(0);

    const {showedItem, pages} = useMemo(() => {
        const count = Math.ceil(data.length / limit);

        return {
            showedItem: data.slice(limit * currentPage, limit * (currentPage + 1)),
            pages: new Array(count).fill(0).map((_, i) => i),
        };
    }, [currentPage, data, limit]);

    const entries = (Object.entries(columns) as [Key, Column | undefined][]).filter(
        (entry): entry is [Key, Column] => Boolean(entry[1]),
    );

    function renderItem(key: Key, item: Item) {
        const render = renderData[key];
        if (render) {
            return render(item);
        }
        const objKey = key as unknown as keyof Item;

        return objKey in item ? `${item[objKey]}` : '';
    }

    const cellClass = (column: Column) =>
        clsx(
            column.numeric && 'kv-num',
            column.strong && 'kv-table-strong',
            (column.align === 'end' || column.numeric) && 'text-right',
        );

    if (data.length === 0) {
        return <p className="kv-table-empty">{empty}</p>;
    }

    return (
        <>
            <div className="kv-table-wrap">
                <table className="kv-table">
                    <thead>
                        <tr>
                            {entries.map(([key, column]) => (
                                <th key={key} className={cellClass(column)}>
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {showedItem.map((item: Item) => (
                            <tr key={itemId(item)}>
                                {entries.map(([key, column]) => (
                                    <td
                                        key={`${itemId(item)}-${key}`}
                                        className={cellClass(column)}
                                    >
                                        {renderItem(key, item)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pages.length > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--border-subtle) px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                        {pages.map((page) => (
                            <Button
                                key={page}
                                variant={
                                    page === currentPage ? 'primary' : 'secondary'
                                }
                                size="sm"
                                className="kv-num"
                                aria-current={
                                    page === currentPage ? 'page' : undefined
                                }
                                onClick={() => setCurrentPage(page)}
                            >
                                {page + 1}
                            </Button>
                        ))}
                    </div>
                    <span className="kv-caption kv-num">
                        Strona {currentPage + 1} z {pages.length}
                    </span>
                </div>
            )}
        </>
    );
}
