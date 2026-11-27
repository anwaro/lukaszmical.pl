'use client';

import React, {ReactNode, useMemo, useState} from 'react';

import Image from 'next/image';
import {clsx} from 'clsx';
import {ArrowLeft, Folder} from 'lucide-react';

import {Button} from '@/admin/components/button/button';
import {fieldInputClassName} from '@/admin/components/form/field-input-class-name';
import {usePagination} from '@/admin/components/pagination/use-pagination';
import {distinctFolders, folderOf} from '@/services/media/media-path';
import {MediaAsset} from '@/types/media';

// The drop-target id for "back to the root" — distinct from every real
// folder name, which `sanitizeFolder` never produces (it strips `_`).
const ROOT_DROP_TARGET = '_root_';

type Props = {
    assets: MediaAsset[];
    mode: 'manage' | 'pick';
    limit?: number;
    onSelect?: (asset: MediaAsset) => void;
    // Manage mode only: the actions rendered under each tile.
    renderActions?: (asset: MediaAsset) => ReactNode;
    // Manage mode only: dragging a tile onto a folder (or back up to the
    // root breadcrumb) moves it there.
    onMoveAsset?: (asset: MediaAsset, folder: string | null) => void;
};

// A thumbnail grid over the media library, paginated client-side like
// `BaseTable` — the whole (cached) bucket listing is already in memory.
// Folders are browsed like a file manager: tiles at the root, one level
// deep, with drag-and-drop onto a folder tile to move a file into it.
export function MediaGrid({
    assets,
    mode,
    limit = 24,
    onSelect,
    renderActions,
    onMoveAsset,
}: Props) {
    const [query, setQuery] = useState('');
    const [folder, setFolder] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<string | null>(null);

    const folders = useMemo(() => distinctFolders(assets), [assets]);
    const showFolders = !query && folder === null && folders.length > 0;
    const canDrag = mode === 'manage' && Boolean(onMoveAsset);

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

    const dropTargetProps = (target: string | null) => {
        if (!canDrag) {
            return {};
        }
        const id = target ?? ROOT_DROP_TARGET;
        return {
            onDragOver: (event: React.DragEvent) => event.preventDefault(),
            onDragEnter: () => setDragOver(id),
            onDragLeave: () =>
                setDragOver((current) => (current === id ? null : current)),
            onDrop: (event: React.DragEvent) => {
                event.preventDefault();
                setDragOver(null);
                const key = event.dataTransfer.getData('text/plain');
                const asset = assets.find((item) => item.key === key);
                if (asset && folderOf(asset.key) !== target) {
                    onMoveAsset?.(asset, target);
                }
            },
        };
    };

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
            {!query && folder !== null && (
                <button
                    type="button"
                    className={clsx(
                        'mb-4 flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium',
                        'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
                        'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
                        dragOver === ROOT_DROP_TARGET &&
                            'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
                    )}
                    onClick={() => {
                        setFolder(null);
                        setPage(0);
                    }}
                    {...dropTargetProps(null)}
                >
                    <ArrowLeft className="size-4 shrink-0" strokeWidth={1.8} aria-hidden />
                    Wszystkie pliki
                    <span className="font-normal text-slate-400 dark:text-slate-500">
                        / {folder}
                    </span>
                </button>
            )}
            {filtered.length === 0 && !showFolders ? (
                <p className="px-4 py-10 text-center text-slate-500 dark:text-slate-400">
                    Nie ma jeszcze żadnych plików.
                </p>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
                    {showFolders &&
                        folders.map((name) => (
                            <button
                                key={name}
                                type="button"
                                className={clsx(
                                    'flex flex-col items-center justify-center gap-1 rounded-lg',
                                    'border border-slate-200 bg-white p-2 text-center',
                                    'hover:border-slate-300 hover:bg-slate-50',
                                    'dark:border-slate-800 dark:bg-slate-900',
                                    'dark:hover:border-slate-600 dark:hover:bg-slate-800',
                                    dragOver === name &&
                                        'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-500/10',
                                )}
                                onClick={() => {
                                    setFolder(name);
                                    setPage(0);
                                }}
                                {...dropTargetProps(name)}
                            >
                                <Folder
                                    className="size-10 shrink-0 text-slate-400 dark:text-slate-500"
                                    strokeWidth={1.4}
                                    aria-hidden
                                />
                                <span className="w-full truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                                    {name}
                                </span>
                            </button>
                        ))}
                    {shown.map((asset) => (
                        <div
                            key={asset.key}
                            draggable={canDrag}
                            onDragStart={(event) => {
                                event.dataTransfer.setData('text/plain', asset.key);
                                event.dataTransfer.effectAllowed = 'move';
                            }}
                            className={clsx(
                                'flex flex-col rounded-lg border border-slate-200 bg-white p-1.5',
                                'dark:border-slate-800 dark:bg-slate-900',
                                mode === 'pick' &&
                                    'cursor-pointer hover:border-slate-300 hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-800',
                                canDrag && 'cursor-grab active:cursor-grabbing',
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
                                width={120}
                                height={90}
                                className="h-20 w-full rounded-lg object-cover"
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
