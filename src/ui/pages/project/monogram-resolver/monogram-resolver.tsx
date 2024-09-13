'use client';

import React, {useState} from 'react';

import {PageMonogramResolverLogs} from '@/ui/pages/project/monogram-resolver/monogram-resolver-logs';
import {CellStatus} from '@/services/projects/monogram-resolver/model/model-cell';
import {PageMonogramResolverStats} from '@/ui/pages/project/monogram-resolver/monogram-resolver-stats';

import {PageMonogramResolverGroups} from './monogram-resolver-groups';
import {usePageMonogramResolver} from './monogram-resolver.hook';

export function PageMonogramResolver() {
    const {events, canvas, canvasBg, onFileChange, groups, cells} =
        usePageMonogramResolver();
    const resolved = cells.filter((c) => c.status !== CellStatus.unknown).length;

    const [visiblePreview, setVisiblePreview] = useState(false);
    const [visible, setVisible] = useState(false);

    return (
        <div className="container mx-auto mt-12 grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
            <div className="flex flex-col gap-6">
                <label className="flex rounded border border-white p-4">
                    <input
                        type={'file'}
                        accept={'image/*'}
                        onChange={onFileChange}
                    />
                </label>
                <div className="rounded border border-white p-4">
                    <input
                        type="checkbox"
                        value={visiblePreview ? 'true' : ''}
                        onChange={(e) => setVisiblePreview(e.target.checked)}
                    />
                    <div className={`relative ${visiblePreview ? '' : 'opacity-0'}`}>
                        <canvas
                            ref={canvasBg}
                            className="relative left-1/2 top-0 -translate-x-1/2"
                        />
                        <canvas
                            ref={canvas}
                            className="absolute left-1/2 top-0 -translate-x-1/2"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-6">
                <div className={'rounded border border-white p-4'}>
                    <input
                        type="checkbox"
                        value={visible ? 'true' : ''}
                        onChange={(e) => setVisible(e.target.checked)}
                    />
                    <pre>
                        GROUPS ({resolved}/{cells.length})
                    </pre>
                    <div className={visible ? '' : 'opacity-10'}>
                        <PageMonogramResolverGroups groups={groups} cells={cells} />
                    </div>
                </div>
                <div className="rounded border border-white p-4">
                    <pre>LOGS</pre>
                    <PageMonogramResolverLogs events={events} />
                </div>
                <div className="rounded border border-white p-4">
                    <pre>RESOLVERS STATS</pre>
                    <PageMonogramResolverStats cells={cells} />
                </div>
            </div>
        </div>
    );
}
