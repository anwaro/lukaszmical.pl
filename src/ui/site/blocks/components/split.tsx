import {clsx} from 'clsx';

import {sectionGap} from './shared';

// Row of columns; `id` makes the section a target of `/#id` links.
export function Split({id, children}: PWC<{id?: string}>) {
    return (
        <section
            id={id}
            className={clsx('flex flex-wrap gap-x-16 gap-y-8', sectionGap)}
        >
            {children}
        </section>
    );
}
