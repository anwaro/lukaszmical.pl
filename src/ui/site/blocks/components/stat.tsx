import {clsx} from 'clsx';

import {panel} from './shared';

// A single big number inside <Stats>.
export function Stat({value, children}: PWC<{value: string}>) {
    return (
        <div className={clsx(panel, 'px-5 py-6')}>
            <p className="m-0 font-term text-4xl font-bold tracking-[-0.03em] text-accent">
                {value}
            </p>
            <div className="mt-1 text-sm text-soft">{children}</div>
        </div>
    );
}
