'use client';

import {ChangeEventHandler, useCallback, useRef, useSyncExternalStore} from 'react';

import {MonogramResolverController} from '@/services/projects/monogram-resolver/controller';

export function usePageMonogramResolver() {
    const app = useRef(new MonogramResolverController());

    const onFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            const file = event.target.files?.[0];
            if (file) {
                setTimeout(() => app.current.onFileSelect(file), 10);
                event.target.value = '';
            }
        },
        [],
    );

    return {
        events: useSyncExternalStore(
            app.current.store.subscribe,
            () => app.current.store.getSnapshot().events,
        ),
        image: useSyncExternalStore(
            app.current.store.subscribe,
            () => app.current.store.getSnapshot().image,
        ),
        processedImage: useSyncExternalStore(
            app.current.store.subscribe,
            () => app.current.store.getSnapshot().processedImage,
        ),
        cells: useSyncExternalStore(
            app.current.store.subscribe,
            () => app.current.store.getSnapshot().cells,
        ),
        groups: useSyncExternalStore(
            app.current.store.subscribe,
            () => app.current.store.getSnapshot().groups,
        ),
        onFileChange,
    };
}
