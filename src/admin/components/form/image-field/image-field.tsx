import {useState} from 'react';

import {useField} from 'formik';
import {X} from 'lucide-react';

import {MediaPickerModal} from '@/admin/components/media/media-picker-modal';

type Props = {
    name: string;
    className?: string;
    placeholder?: string;
};

export const ImageField = ({name, className, placeholder}: Props) => {
    const [field, _, {setValue}] = useField<string>(name);
    const [open, setOpen] = useState(false);

    return (
        <>
            <input
                value={field.value}
                className={className}
                placeholder={placeholder}
                readOnly
                onClick={() => setOpen(true)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setOpen(true);
                    }
                }}
            />

            {Boolean(field.value) && (
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

            <MediaPickerModal
                open={open}
                onClose={() => setOpen(false)}
                onSelect={(asset) => setValue(asset.url)}
            />
        </>
    );
};
