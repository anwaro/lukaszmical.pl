'use client';

import React, {ReactNode} from 'react';

import {usePagination} from '@/admin/components/pagination/use-pagination';

import {Button} from '../button/button';
import {
    BaseTableColumn,
    baseTableCellClassName,
    baseTableCellValue,
    baseTableColumnEntries,
    baseTablePageNumbers,
} from './base-table-model';

type Props<Item, Key extends string> = {
    data: Item[];
    itemId: (item: Item) => string;
    // A column set to undefined is left out.
    columns: Partial<Record<Key, BaseTableColumn>>;
    renderData: Partial<Record<Key, (object: Item) => ReactNode>>;
    limit?: number;
    empty?: ReactNode;
};

// A table for a flush card: micro-label header, rows split by a thin border,
// scrolls sideways on narrow screens.
export function BaseTable<Item extends object, Key extends string>({
    data,
    limit = 20,
    renderData,
    columns,
    itemId,
    empty = 'Brak pozycji.',
}: Props<Item, Key>) {
    const {page: currentPage, setPage: setCurrentPage, pageCount, pageItems: showedItem} =
        usePagination(data, limit);
    const pages = baseTablePageNumbers(pageCount);
    const entries = baseTableColumnEntries(columns);

    if (data.length === 0) {
        return (
            <p className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                {empty}
            </p>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr>
                            {entries.map(([key, column]) => (
                                <th
                                    key={key}
                                    className={`bg-slate-50 px-4 py-2.5 text-xs font-medium tracking-wide whitespace-nowrap text-slate-400 uppercase dark:bg-slate-800/50 ${baseTableCellClassName(column)}`}
                                >
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
                                        className={`border-t border-slate-100 px-4 py-3 align-middle text-slate-500 dark:border-slate-800 dark:text-slate-400 ${baseTableCellClassName(column)}`}
                                    >
                                        {baseTableCellValue(key, item, renderData)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pages.length > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
                    <div className="flex flex-wrap gap-1">
                        {pages.map((page) => (
                            <Button
                                key={page}
                                variant={
                                    page === currentPage ? 'primary' : 'secondary'
                                }
                                size="sm"
                                className="tabular-nums"
                                aria-current={
                                    page === currentPage ? 'page' : undefined
                                }
                                onClick={() => setCurrentPage(page)}
                            >
                                {page + 1}
                            </Button>
                        ))}
                    </div>
                    <span className="text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
                        Strona {currentPage + 1} z {pages.length}
                    </span>
                </div>
            )}
        </>
    );
}
