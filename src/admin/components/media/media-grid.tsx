'use client';

import React, {ReactNode, useMemo, useState} from 'react';

import Image from 'next/image';

import {Button} from '@/admin/components/button/button';
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
                className="kv-input mb-4"
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
                        className="kv-chip"
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
                            className="kv-chip"
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
                <p className="kv-table-empty">Nie ma jeszcze żadnych plików.</p>
            ) : (
                <div className="kv-media-grid">
                    {shown.map((asset) => (
                        <div
                            key={asset.key}
                            className="kv-media-tile"
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
                                className="kv-caption mt-1 truncate"
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
                            className="kv-num"
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
