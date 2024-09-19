'use client';

import React from 'react';

import {PageMonogramResolverLogs} from '@/ui/pages/project/monogram-resolver/components/monogram-resolver-logs';
import {PageMonogramResolverStats} from '@/ui/pages/project/monogram-resolver/components/monogram-resolver-stats';
import {PageMonogramResolverBox} from '@/ui/pages/project/monogram-resolver/components/monogram-resolver-box';
import {PageMonogramResolverImage} from '@/ui/pages/project/monogram-resolver/components/monogram-resolver-image';

import {PageMonogramResolverGrid} from './components/grid/monogram-resolver-grid';
import {usePageMonogramResolver} from './monogram-resolver.hook';

export function PageMonogramResolver() {
    const {events, onFileChange, groups, cells, image, processedImage} =
        usePageMonogramResolver();

    return (
        <div className="container mx-auto mt-12 flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="flex flex-col gap-6 xl:col-span-4">
                    <PageMonogramResolverBox title={`FILE ${image.name}`}>
                        <input
                            type={'file'}
                            accept={'image/*'}
                            onChange={onFileChange}
                        />
                    </PageMonogramResolverBox>
                    <PageMonogramResolverBox title={'LOGS'}>
                        <PageMonogramResolverLogs events={events} />
                    </PageMonogramResolverBox>

                    <PageMonogramResolverBox title={'RESOLVERS STATS'}>
                        <PageMonogramResolverStats cells={cells} />
                    </PageMonogramResolverBox>
                </div>
                <div className="flex flex-col gap-6 xl:col-span-8">
                    <PageMonogramResolverGrid groups={groups} cells={cells} />
                </div>
            </div>
            <PageMonogramResolverImage
                image={image}
                processedImage={processedImage}
                groups={groups}
            />
        </div>
    );
}
