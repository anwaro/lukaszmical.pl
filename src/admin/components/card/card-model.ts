import {clsx} from 'clsx';

export type CardPadding = 'md' | 'lg' | 'none';

export function cardClassName(padding: CardPadding, className?: string) {
    return clsx(
        'box-border rounded-xl border border-slate-200 bg-white p-4',
        'shadow-none dark:border-slate-800 dark:bg-slate-900',
        padding === 'lg' && 'p-5',
        padding === 'none' && 'overflow-hidden p-0',
        className,
    );
}
