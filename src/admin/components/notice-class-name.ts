import {clsx} from 'clsx';

export function noticeDangerClassName(className?: string) {
    return clsx(
        'rounded-lg px-3 py-2.5 text-sm whitespace-pre-wrap text-rose-700',
        'ring-1 ring-rose-600/20 ring-inset dark:text-rose-400',
        'bg-rose-50 dark:bg-rose-500/10 dark:ring-rose-500/20',
        className,
    );
}
