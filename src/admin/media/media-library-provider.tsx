'use client';

import React, {createContext, useCallback, useContext, useState} from 'react';

import {MediaAsset} from '@/types/media';

type MediaLibraryContextValue = {
    assets: MediaAsset[];
    addAsset: (asset: MediaAsset) => void;
    removeAsset: (key: string) => void;
};

const MediaLibraryContext = createContext<MediaLibraryContextValue>({
    assets: [],
    addAsset: () => undefined,
    removeAsset: () => undefined,
});

type Props = PWC<{initialAssets: MediaAsset[]}>;

// Holds the media library for the whole admin tree, seeded server-side from
// the cached bucket listing. Uploads/deletes made anywhere (the picker modal,
// the library page) update this list immediately, since the cache tag alone
// wouldn't re-render an already-mounted client tree.
export function MediaLibraryProvider({initialAssets, children}: Props) {
    const [assets, setAssets] = useState(initialAssets);

    const addAsset = useCallback(
        (asset: MediaAsset) => setAssets((current) => [asset, ...current]),
        [],
    );
    const removeAsset = useCallback(
        (key: string) => setAssets((current) => current.filter((asset) => asset.key !== key)),
        [],
    );

    return (
        <MediaLibraryContext.Provider value={{assets, addAsset, removeAsset}}>
            {children}
        </MediaLibraryContext.Provider>
    );
}

export function useMediaLibrary() {
    return useContext(MediaLibraryContext);
}
