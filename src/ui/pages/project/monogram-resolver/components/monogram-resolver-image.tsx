'use client';

import React, {Fragment, useCallback, useMemo, useState} from 'react';

import {GroupModel} from '@/services/projects/monogram-resolver/model/model-group';
import {ImageFileData} from '@/services/projects/monogram-resolver/model/model-store';

import {PageMonogramResolverBox} from './monogram-resolver-box';

type Props = {
    image: ImageFileData;
    processedImage: ImageFileData;
    groups: GroupModel[];
};

export function PageMonogramResolverImage({image, processedImage, groups}: Props) {
    const [imageMode, setImageMode] = useState<'original' | 'processed'>('original');
    const [width, setWidth] = useState(500);

    const bgStyles = useMemo(() => {
        return {
            width: width,
            aspectRatio: image.data.width / image.data.height,
            backgroundImage: `url(${imageMode === 'original' ? image.src : processedImage.src})`,
        };
    }, [imageMode, image, image.data.width, width]);

    const value = useCallback(
        (value: number) => {
            const scale = width / image.data.width;
            return `${value * scale}px`;
        },
        [width, image],
    );

    const groupStyle = useCallback(
        (value: number) => {
            const scale = width / image.data.width;
            return `${value * scale}px`;
        },
        [width, image],
    );

    return (
        <PageMonogramResolverBox
            title={'LOADED IMAGE'}
            hidden
            middle={
                <div className="flex gap-3">
                    <div className="grid grid-cols-2">
                        <div
                            className="flex cursor-pointer justify-center rounded-l border px-2 py-1"
                            onClick={() => setImageMode('original')}
                        >
                            Original
                        </div>
                        <div
                            className="flex cursor-pointer justify-center rounded-r border px-2 py-1"
                            onClick={() => setImageMode('processed')}
                        >
                            Processed
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <div
                            className="flex cursor-pointer justify-center rounded-l border px-2 py-1"
                            onClick={() => setWidth(Math.max(400, width - 100))}
                        >
                            –🔎
                        </div>
                        <div
                            className="flex cursor-pointer justify-center rounded-r border px-2 py-1"
                            onClick={() => setWidth(Math.min(1400, width + 100))}
                        >
                            🔎+
                        </div>
                    </div>
                </div>
            }
        >
            <div className="mx-auto bg-cover" style={bgStyles}>
                {groups.map((group) => (
                    <Fragment key={group.id}>
                        <div className={''} />
                    </Fragment>
                ))}
            </div>
        </PageMonogramResolverBox>
    );
}
