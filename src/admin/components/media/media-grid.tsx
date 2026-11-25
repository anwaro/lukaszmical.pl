'use client';

import React, {ReactNode, useMemo, useState} from 'react';

import Image from 'next/image';

import {Button} from '@/admin/components/button/button';
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
export function MediaGrid({assets, mode, limit = 24, onSelect, renderActions}: Props) {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(0);

    const filtered = useMemo(
        () => assets.filter((asset) => asset.key.toLowerCase().includes(query.toLowerCase())),
        [assets, query],
    );

    const pages = Math.ceil(filtered.length / limit);
    const shown = filtered.slice(limit * page, limit * (page + 1));

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
                            <p className="kv-caption mt-1 truncate" title={asset.key}>
                                {asset.key}
                            </p>
                            {mode === 'manage' && renderActions?.(asset)}
                        </div>
                    ))}
                </div>
            )}
            {pages > 1 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {new Array(pages).fill(0).map((_, i) => (
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
