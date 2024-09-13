'use client';

import {
    ChangeEventHandler,
    useCallback,
    useEffect,
    useRef,
    useSyncExternalStore,
} from 'react';

import {MonogramResolverController} from '@/services/projects/monogram-resolver/controller';
import {MonogramResolverCanvas} from '@/services/projects/monogram-resolver/canvas/canvas-renderer';

export function usePageMonogramResolver() {
    const canvas = useRef<HTMLCanvasElement>(null!);
    const canvasBg = useRef<HTMLCanvasElement>(null!);
    const app = useRef(new MonogramResolverController());
    const renderer = useRef(new MonogramResolverCanvas(canvasBg, canvas));

    const events = useSyncExternalStore(
        app.current.store.subscribe,
        () => app.current.store.getSnapshot().events,
    );

    const cells = useSyncExternalStore(
        app.current.store.subscribe,
        () => app.current.store.getSnapshot().cells,
    );

    const groups = useSyncExternalStore(
        app.current.store.subscribe,
        () => app.current.store.getSnapshot().groups,
    );

    useEffect(() => {
        const lastEvent = events.findLast((e) => !e.inProgress);
        if (lastEvent) {
            renderer.current.update(app.current.store.data, lastEvent);
        }
    }, [events]);

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
        canvasBg,
        canvas,
        events,
        cells,
        groups,
        onFileChange,
    };
}
