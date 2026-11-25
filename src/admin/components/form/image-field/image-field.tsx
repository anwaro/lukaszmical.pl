import {ChangeEvent, useEffect, useEffectEvent} from 'react';

import {useField} from 'formik';
import {LoaderCircle, X} from 'lucide-react';

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

    const onUploaded = useEffectEvent((uploadedUrl: string) => {
        setValue(uploadedUrl);
    });

    useEffect(() => {
        if (url) {
            onUploaded(url);
        }
    }, [url]);

    return (
        <>
            <input
                value={field.value}
                className={className}
                placeholder={placeholder}
                readOnly
            />
            <input
                type="file"
                className="absolute top-0 left-0 size-full cursor-pointer opacity-0 outline-none"
                onChange={handleFileChange}
                accept={accept}
            />

            {isPending && (
                <div className="kv-input-addon right-0 text-(--ink-muted)">
                    <LoaderCircle className="kv-spin size-4" strokeWidth={1.8} />
                </div>
            )}
            {Boolean(field.value && !isPending) && (
                <button
                    type="button"
                    onClick={() => setValue('')}
                    aria-label="Usuń obraz"
                    title="Usuń obraz"
                    className="kv-input-addon pointer-events-auto right-0 z-10 cursor-pointer text-(--ink-muted) hover:text-(--ink)"
                >
                    <X className="size-4" strokeWidth={1.8} />
                </button>
            )}
        </>
    );
};
