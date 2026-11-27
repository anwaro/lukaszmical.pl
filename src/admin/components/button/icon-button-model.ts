import {clsx} from 'clsx';

export type IconButtonTone = 'default' | 'danger';

export function iconButtonClassName(tone: IconButtonTone, className?: string) {
    return clsx(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
        'cursor-pointer border-0 bg-transparent text-slate-500 transition-colors',
        'hover:bg-slate-100 hover:text-slate-700 disabled:opacity-60',
        'focus-visible:outline-2 disabled:cursor-default',
        'focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        'active:outline-2 active:outline-offset-2 active:outline-blue-500',
        'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200',
        tone === 'danger' &&
            'hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/10 ' +
                'dark:hover:text-rose-400 active:outline-rose-500',
        className,
    );
}
