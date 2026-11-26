'use client';

import React, {ReactNode, useMemo, useState} from 'react';

import Image from 'next/image';
import {clsx} from 'clsx';

import {Button} from '@/admin/components/button/button';
import {chipClassName} from '@/admin/components/chip-class-name';
import {fieldInputClassName} from '@/admin/components/form/field-input-class-name';
import {usePagination} from '@/admin/components/pagination/use-pagination';
import {distinctFolders, folderOf} from '@/services/media/media-path';
import {MediaAsset} from '@/types/media';

type Props = {
    assets: MediaAsset[];
    mode: 'manage' | 'pick';
    limit?: number;
    onSelect?: (asset: MediaAsset) => void;
    // Manage mode only: the actions rendered under each tile.
    renderActions?: (asset: MediaAsset) => ReactNode;
};

// A thumbnail grid over the media library, paginated client-side like
// `BaseTable` — the whole (cached) bucket listing is already in memory.
export function MediaGrid({
    assets,
    mode,
    limit = 24,
    onSelect,
    renderActions,
}: Props) {
    const [query, setQuery] = useState('');
    const [folder, setFolder] = useState<string | null>(null);

    const folders = useMemo(() => distinctFolders(assets), [assets]);

    // A search looks across every folder; with no query, the grid is scoped
    // to the current one (folders are navigated, not filtered by typing).
    const filtered = useMemo(() => {
        const needle = query.toLowerCase();
        return assets.filter((asset) => {
            if (!asset.key.toLowerCase().includes(needle)) {
                return false;
            }
            return query !== '' || folderOf(asset.key) === folder;
        });
    }, [assets, query, folder]);

    const {
        page,
        setPage,
        pageCount,
        pageItems: shown,
    } = usePagination(filtered, limit);

    return (
        <div>
            <input
                className={fieldInputClassName('mb-4')}
                placeholder="Szukaj po nazwie pliku…"
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(0);
                }}
            />
            {!query && folders.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1">
                    <button
                        type="button"
                        aria-pressed={folder === null}
                        className={chipClassName()}
                        onClick={() => {
                            setFolder(null);
                            setPage(0);
                        }}
                    >
                        Wszystkie pliki
                    </button>
                    {folders.map((name) => (
                        <button
                            key={name}
                            type="button"
                            aria-pressed={folder === name}
                            className={chipClassName()}
                            onClick={() => {
                                setFolder(name);
                                setPage(0);
                            }}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}
            {filtered.length === 0 ? (
                <p className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                    Nie ma jeszcze żadnych plików.
                </p>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
                    {shown.map((asset) => (
                        <div
                            key={asset.key}
                            className={clsx(
                                'flex flex-col rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900',
                                mode === 'pick' &&
                                    'cursor-pointer hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-800',
                            )}
                            {...(mode === 'pick'
                                ? {
                                      role: 'button' as const,
                                      tabIndex: 0,
                                      onClick: () => onSelect?.(asset),
                                      onKeyDown: (event: React.KeyboardEvent) => {
                                          if (
                                              event.key === 'Enter' ||
                                              event.key === ' '
                                          ) {
                                              event.preventDefault();
                                              onSelect?.(asset);
                                          }
                                      },
                                  }
                                : {})}
                        >
                            <Image
                                src={asset.url}
                                alt=""
                                width={160}
                                height={120}
                                className="h-28 w-full rounded-lg object-cover"
                                unoptimized={asset.key.endsWith('.svg')}
                            />
                            <p
                                className="mt-1 truncate text-xs font-medium text-slate-500 dark:text-slate-400"
                                title={asset.key}
                            >
                                {asset.key}
                            </p>
                            {mode === 'manage' && renderActions?.(asset)}
                        </div>
                    ))}
                </div>
            )}
            {pageCount > 1 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {new Array(pageCount).fill(0).map((_, i) => (
                        <Button
                            key={i}
                            variant={i === page ? 'primary' : 'secondary'}
                            size="sm"
                            className="tabular-nums"
                            onClick={() => setPage(i)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
