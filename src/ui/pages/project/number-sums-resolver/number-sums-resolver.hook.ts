'use client';

import {
    ChangeEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';

import {NumberSumsResolverController} from '@/services/projects/number-sums-resolver/controller';
import {NumberSumsResolverCanvas} from '@/services/projects/number-sums-resolver/canvas/canvas-renderer';

export function usePageNumberSumsResolver() {
    const canvas = useRef<HTMLCanvasElement>(null!);
    const canvasBg = useRef<HTMLCanvasElement>(null!);
    const [app] = useState(() => new NumberSumsResolverController());
    const renderer = useRef(new NumberSumsResolverCanvas(canvasBg, canvas));

    const store = useSyncExternalStore(
        app.store.subscribe,
        app.store.getSnapshot,
    );

    useEffect(() => {
        const lastEvent = store.events.findLast((e) => !e.inProgress);
        if (lastEvent) {
            renderer.current.update(app.store.data, lastEvent);
        }
    }, [store.events, app]);

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
        canvasBg,
        canvas,
        // events: store.events,
        events: useSyncExternalStore(
            app.store.subscribe,
            () => app.store.getSnapshot().events,
        ),
        cells: store.cells,
        groups: store.groups,
        onFileChange,
    };
}
