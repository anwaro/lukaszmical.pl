import {ReactNode} from 'react';

import {clsx} from 'clsx';

export type BaseTableColumn = {
    label: ReactNode;
    // Tabular numbers, right aligned.
    numeric?: boolean;
    // The main column of a row: ink, medium weight.
    strong?: boolean;
    align?: 'start' | 'end';
};

export function baseTableColumnEntries<Key extends string>(
    columns: Partial<Record<Key, BaseTableColumn>>,
) {
    return (Object.entries(columns) as [Key, BaseTableColumn | undefined][]).filter(
        (entry): entry is [Key, BaseTableColumn] => Boolean(entry[1]),
    );
}

export function baseTableCellClassName(column: BaseTableColumn) {
    return clsx(
        column.numeric && 'tabular-nums',
        column.strong && 'font-medium whitespace-nowrap text-slate-900 dark:text-white',
        (column.align === 'end' || column.numeric) && 'text-right',
    );
}

export function baseTableCellValue<Item extends object, Key extends string>(
    key: Key,
    item: Item,
    renderData: Partial<Record<Key, (object: Item) => ReactNode>>,
): ReactNode {
    const render = renderData[key];
    if (render) {
        return render(item);
    }
    const objKey = key as unknown as keyof Item;
    return objKey in item ? `${item[objKey]}` : '';
}

export function baseTablePageNumbers(pageCount: number) {
    return new Array(pageCount).fill(0).map((_, index) => index);
}
