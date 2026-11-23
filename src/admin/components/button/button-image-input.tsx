import React, {ChangeEvent, useEffect, useEffectEvent} from 'react';

import {mdiImage} from '@mdi/js';

import {useImageField} from '@/admin/components/form/image-field/image-field.hook';

import {Button} from './button';

type Props = {
    className?: string;
    onChange: (url: string) => void;
};

export function ButtonImageInput({onChange, className}: Props) {
    const {url, isPending, upload} = useImageField();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget?.files?.[0]) {
            upload(event.currentTarget.files[0]);
        }
    };

    const onUploaded = useEffectEvent((uploadedUrl: string) => {
        onChange(uploadedUrl);
    });

    useEffect(() => {
        if (url) {
            onUploaded(url);
        }
    }, [url]);

    return (
        <div className={`relative ${className}`}>
            <Button
                color="info"
                icon={mdiImage}
                title={'Insert image'}
                type={'button'}
                loading={isPending}
                small
            />
            <input
                type="file"
                className="absolute top-0 left-0 size-full cursor-pointer opacity-0 outline-none"
                onChange={handleFileChange}
            />
        </div>
    );
}
