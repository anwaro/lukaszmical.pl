import {clsx} from 'clsx';

import {panel} from './shared';

// Embedded live app.
export function Demo({
    src,
    title,
    ratio = '16 / 9',
}: {
    src: string;
    title?: string;
    ratio?: string;
}) {
    return (
        <iframe
            src={src}
            title={title ?? 'demo'}
            loading="lazy"
            style={{aspectRatio: ratio}}
            className={clsx(panel, 'w-full')}
        />
    );
}
