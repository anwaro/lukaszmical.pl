import {clsx} from 'clsx';

import {panel} from './shared';

// A single step inside <Flow>.
export function Step({
    title,
    highlight,
    children,
}: PWC<{title: string; highlight?: boolean}>) {
    return (
        <div
            className={clsx(
                panel,
                'flex-[1_1_170px] p-5',
                highlight && 'border-accent',
            )}
        >
            <p className="m-0 mb-2 font-term text-base font-bold text-fg">{title}</p>
            <div className="text-sm text-soft">{children}</div>
        </div>
    );
}
