import {ChangeEvent, useEffect} from 'react';

import {useField} from 'formik';
import {mdiClose, mdiLoading} from '@mdi/js';

import {Icon} from '../../icon/icon';
import {useImageField} from './image-field.hook';

type Props = {
    name: string;
    accept?: string;
    className?: string;
    placeholder?: string;
};

export const ImageField = ({name, accept, className, placeholder}: Props) => {
    const [field, _, {setValue}] = useField<string>(name);
    const {url, isPending, upload} = useImageField();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget?.files?.[0]) {
            upload(event.currentTarget.files[0]);
        }
    };

    useEffect(() => {
        if (url) {
            setValue(url);
        }
    }, [url]);

    return (
        <>
            <input
                value={field.value}
                className={className}
                placeholder={placeholder}
            />
            <input
                type="file"
                className="absolute left-0 top-0 size-full cursor-pointer opacity-0 outline-none"
                onChange={handleFileChange}
                accept={accept}
            />

            {isPending && (
                <div className="height-full absolute inset-y-0 right-0 flex w-12 items-center justify-center">
                    <Icon path={mdiLoading} size={34} className="animate-spin" />
                </div>
            )}
            {Boolean(field.value && !isPending) && (
                <div
                    onClick={() => setValue('')}
                    className="height-full absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center"
                >
                    <Icon path={mdiClose} size={34} />
                </div>
            )}
        </>
    );
};
