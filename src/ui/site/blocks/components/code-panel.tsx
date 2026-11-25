import {clsx} from 'clsx';

import '@/admin/css/github-dark.css';

import {panel} from './shared';

// Titled frame around a fenced code block.
export function CodePanel({file, children}: PWC<{file: string}>) {
    return (
        <div className={clsx(panel, 'overflow-hidden')}>
            <div className="border-b border-line px-4 py-3 font-term text-xs text-muted">
                {file}
            </div>
            {children}
        </div>
    );
}
