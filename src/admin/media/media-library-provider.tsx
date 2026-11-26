'use client';

import React, {createContext, useCallback, useContext, useState} from 'react';

import {MediaAsset} from '@/types/media';

type MediaLibraryContextValue = {
    assets: MediaAsset[];
    addAsset: (asset: MediaAsset) => void;
    removeAsset: (key: string) => void;
    // A move changes the asset's key (and url) — swaps the entry in place.
    replaceAsset: (previousKey: string, asset: MediaAsset) => void;
};

const MediaLibraryContext = createContext<MediaLibraryContextValue>({
    assets: [],
    addAsset: () => undefined,
    removeAsset: () => undefined,
    replaceAsset: () => undefined,
});

type Props = PWC<{initialAssets: MediaAsset[]}>;

// Holds the media library for the whole admin tree, seeded server-side from
// the cached bucket listing. Uploads/deletes made anywhere (the picker modal,
// the library page) update this list immediately, since the cache tag alone
// wouldn't re-render an already-mounted client tree.
export function MediaLibraryProvider({initialAssets, children}: Props) {
    const [assets, setAssets] = useState(initialAssets);
    // Tracks the last `initialAssets` reference seen, so a genuinely new one
    // (the layout re-rendering with a fresh list — this tab's own
    // uploads/deletes, but also, once Next refreshes this route, another
    // tab's) resets `assets` during render instead of needing an effect.
    // `useState`'s initial value only applies at mount, so without this the
    // context would otherwise keep serving the list it was first seeded with.
    const [seenAssets, setSeenAssets] = useState(initialAssets);
    if (initialAssets !== seenAssets) {
        setSeenAssets(initialAssets);
        setAssets(initialAssets);
    }

    // Deduped by key: a server refresh (triggered by this same upload's
    // `updateTag`) can deliver the fresh list — already containing this
    // asset — before or after this optimistic add runs, so without the
    // check the asset could end up listed twice.
    const addAsset = useCallback(
        (asset: MediaAsset) =>
            setAssets((current) =>
                current.some((existing) => existing.key === asset.key)
                    ? current
                    : [asset, ...current],
            ),
        [],
    );
    const removeAsset = useCallback(
        (key: string) =>
            setAssets((current) => current.filter((asset) => asset.key !== key)),
        [],
    );
    const replaceAsset = useCallback(
        (previousKey: string, asset: MediaAsset) =>
            setAssets((current) =>
                current.map((existing) =>
                    existing.key === previousKey ? asset : existing,
                ),
            ),
        [],
    );

    return (
        <MediaLibraryContext.Provider
            value={{assets, addAsset, removeAsset, replaceAsset}}
        >
            {children}
        </MediaLibraryContext.Provider>
    );
}

export function useMediaLibrary() {
    return useContext(MediaLibraryContext);
}
