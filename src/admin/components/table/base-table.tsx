'use client';

import React, {ReactNode, useMemo, useState} from 'react';

import Button from '../Button';
import Buttons from '../Buttons';

type Props<Item, Key extends keyof Partial<Item> | string> = {
    data: Item[];
    itemId: (item: Item) => string;
    head: Record<Key, ReactNode | (() => ReactNode)>;
    renderData: Partial<Record<Key, (object: Item) => ReactNode>>;
    limit?: number;
};

export function BaseTable<
    Item extends object,
    Key extends keyof Partial<Item> | string,
>({data, limit = 5, renderData, head, itemId}: Props<Item, Key>) {
    const [currentPage, setCurrentPage] = useState(0);

    const {showedItem, pages} = useMemo(() => {
        const count = Math.ceil(data.length / limit);

        return {
            showedItem: data.slice(limit * currentPage, limit * (currentPage + 1)),
            pages: new Array(count).fill(0).map((_, i) => i),
        };
    }, [currentPage, data, limit]);

    function renderItem(key: Key, item: Item) {
        if (renderData && key in renderData && renderData[key]) {
            return renderData[key](item);
        }
        const objKey = key as keyof typeof item;

        if (objKey in item) {
            return `${item[objKey]}`;
        }

        return '';
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        {Object.entries(head).map(([key, label]) => (
                            <th key={key}>
                                {typeof label === 'function' ? label() : label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {showedItem.map((item: Item) => (
                        <tr key={itemId(item)}>
                            {Object.entries(head).map(([key, label]) => (
                                <td
                                    key={`${itemId(item)}-${key}`}
                                    data-label={label}
                                >
                                    {renderItem(key as Key, item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
                <div className="flex flex-col items-center justify-between py-3 md:flex-row md:py-0">
                    <Buttons>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                active={page === currentPage}
                                label={page + 1}
                                color={
                                    page === currentPage ? 'lightDark' : 'whiteDark'
                                }
                                small
                                onClick={() => setCurrentPage(page)}
                            />
                        ))}
                    </Buttons>
                    <small className="mt-6 md:mt-0">
                        Page {currentPage + 1} of {pages.length}
                    </small>
                </div>
            </div>
        </>
    );
}
