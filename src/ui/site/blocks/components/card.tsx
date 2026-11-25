import {clsx} from 'clsx';

import {panel} from './shared';

// A single labelled card inside <Cards>.
export function Card({
    label,
    title,
    children,
}: PWC<{label?: string; title: string}>) {
    return (
        <div className={clsx(panel, 'flex flex-col gap-2 p-5')}>
            {label && (
                <span className="font-term text-[13px] text-accent">{label}</span>
            )}
            <span className="font-term text-lg font-bold text-fg">{title}</span>
            <div className="text-[15px] text-soft">{children}</div>
        </div>
    );
}
