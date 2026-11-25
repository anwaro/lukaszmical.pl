import {clsx} from 'clsx';

import {panel} from './shared';

// Screenshot slot: an image when `src` is set, a labelled placeholder otherwise.
export function Shot({
    src,
    alt,
    ratio = '16 / 8',
    children,
}: PWC<{src?: string; alt?: string; ratio?: string}>) {
    return (
        <div
            style={{aspectRatio: ratio}}
            className={clsx(
                panel,
                'flex items-center justify-center overflow-hidden p-4 text-center font-term text-[13px] text-muted',
                src && 'p-0',
            )}
        >
            {src ? (
                // eslint-disable-next-line nextjs/no-img-element -- CMS content, host unknown
                <img src={src} alt={alt ?? ''} className="size-full object-cover" />
            ) : (
                children
            )}
        </div>
    );
}
