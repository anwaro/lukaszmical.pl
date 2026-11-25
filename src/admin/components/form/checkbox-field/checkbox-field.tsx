import {ReactNode} from 'react';

import {clsx} from 'clsx';

type Props = {
    // The checkbox input.
    children: ReactNode;
    label?: string;
    className?: string;
};

// A checkbox drawn as a switch.
export const CheckboxField = ({children, label, className}: Props) => {
    return (
        <label className={clsx('kv-switch', className)}>
            {children}
            <span className="kv-switch-track" aria-hidden />
            <span>{label}</span>
        </label>
    );
};
