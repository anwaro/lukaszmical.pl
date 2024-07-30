import {ChangeEvent, useState} from 'react';

import {ColorButtonKey} from '../../interfaces';
import Button from '../Button';

type Props = {
    label?: string;
    icon?: string;
    accept?: string;
    color: ColorButtonKey;
    isRoundIcon?: boolean;
};

const FormFilePicker = ({label, icon, accept, color, isRoundIcon}: Props) => {
    const [file, setFile] = useState<File | undefined>(undefined);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget?.files?.[0]) {
            setFile(event.currentTarget.files[0]);
        }
    };

    const showFilename = !isRoundIcon && file;

    return (
        <div className="relative flex items-stretch justify-start">
            <label className="inline-flex">
                <Button
                    className={`${isRoundIcon ? 'size-12' : ''} ${showFilename ? 'rounded-r-none' : ''}`}
                    iconSize={isRoundIcon ? 24 : undefined}
                    label={isRoundIcon ? undefined : label}
                    icon={icon}
                    color={color}
                    roundedFull={isRoundIcon}
                    asAnchor
                />
                <input
                    type="file"
                    className="absolute left-0 top-0 -z-1 size-full cursor-pointer opacity-0 outline-none"
                    onChange={handleFileChange}
                    accept={accept}
                />
            </label>
            {showFilename && (
                <div className="max-w-full grow-0 overflow-x-hidden rounded-r border border-gray-200 bg-gray-100 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
                    <span className="line-clamp-1 max-w-full text-ellipsis">
                        {file.name}
                    </span>
                </div>
            )}
        </div>
    );
};

export default FormFilePicker;
