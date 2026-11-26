import {clsx} from 'clsx';

export function chipClassName(className?: string) {
    return clsx(
        'cursor-pointer rounded-full border border-slate-200 bg-transparent',
        'px-2.5 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-50',
        'aria-pressed:border-blue-500 aria-pressed:bg-blue-50',
        'aria-pressed:text-blue-700 dark:border-slate-700 dark:text-slate-400',
        'dark:hover:bg-slate-800 dark:aria-pressed:bg-blue-500/10',
        'dark:aria-pressed:text-blue-300',
        className,
    );
}
