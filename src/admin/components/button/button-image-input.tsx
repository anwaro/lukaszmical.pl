import {useState} from 'react';

import {Image} from 'lucide-react';

import {MediaPickerModal} from '@/admin/components/media/media-picker-modal';

import {Button} from './button';

type Props = {
    className?: string;
    onChange: (url: string) => void;
};

export function ButtonImageInput({onChange, className}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className={className}>
            <Button
                variant="secondary"
                size="sm"
                icon={Image}
                onClick={() => setOpen(true)}
            >
                Wstaw obraz
            </Button>
            <MediaPickerModal
                open={open}
                onClose={() => setOpen(false)}
                onSelect={(asset) => onChange(asset.url)}
            />
        </div>
    );
}
