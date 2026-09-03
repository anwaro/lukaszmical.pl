'use client';

import {
    ChangeEventHandler,
    useCallback,
    useState,
    useSyncExternalStore,
} from 'react';

import {MonogramResolverController} from '@/services/projects/monogram-resolver/controller';

export function usePageMonogramResolver() {
    const [app] = useState(() => new MonogramResolverController());

    const onFileChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        (event) => {
            const file = event.target.files?.[0];
            if (file) {
                setTimeout(() => app.onFileSelect(file), 10);
                event.target.value = '';
            }
        },
        [app],
    );

    return {
        events: useSyncExternalStore(
            app.store.subscribe,
            () => app.store.getSnapshot().events,
        ),
        image: useSyncExternalStore(
            app.store.subscribe,
            () => app.store.getSnapshot().image,
        ),
        processedImage: useSyncExternalStore(
            app.store.subscribe,
            () => app.store.getSnapshot().processedImage,
        ),
        cells: useSyncExternalStore(
            app.store.subscribe,
            () => app.store.getSnapshot().cells,
        ),
        groups: useSyncExternalStore(
            app.store.subscribe,
            () => app.store.getSnapshot().groups,
        ),
        onFileChange,
    };
}
