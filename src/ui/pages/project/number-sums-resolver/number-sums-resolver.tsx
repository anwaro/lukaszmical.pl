'use client';

import React from 'react';

import {PageNumberSumsResolverLogs} from '@/ui/pages/project/number-sums-resolver/number-sums-resolver-logs';

import {PageNumberSumsResolverGroups} from './number-sums-resolver-groups';
import {usePageNumberSumsResolver} from './number-sums-resolver.hook';

export function PageNumberSumsResolver() {
    const {events, canvas, canvasBg, onFileChange, groups, cells} =
        usePageNumberSumsResolver();

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
                    <div className="opacity5 relative">
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
                <div className="rounded border border-white p-4">
                    <pre>LOGS</pre>
                    <PageNumberSumsResolverLogs events={events} />
                </div>
                <div className="rounded border border-white p-4">
                    <pre>GROUPS</pre>
                    <PageNumberSumsResolverGroups groups={groups} cells={cells} />
                </div>
            </div>
        </div>
    );
}
