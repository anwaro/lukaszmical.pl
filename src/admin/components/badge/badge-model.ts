import {clsx} from 'clsx';

export type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral';

const toneClassName: Record<BadgeTone, string> = {
    success:
        'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 ' +
        'dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
    warning:
        'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 ' +
        'dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
    danger:
        'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 ' +
        'dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20',
    neutral:
        'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20 ' +
        'dark:bg-slate-700/40 dark:text-slate-300',
};

const toneDotClassName: Record<BadgeTone, string> = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
};

export function badgeClassName(
    tone: BadgeTone,
    size: 'md' | 'sm',
    className?: string,
) {
    return clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1',
        'text-xs font-medium whitespace-nowrap',
        size === 'sm' && 'px-2 py-0.5 text-[11px]',
        toneClassName[tone],
        className,
    );
}

export function badgeDotClassName(tone: BadgeTone) {
    return clsx('size-1.5 shrink-0 rounded-full', toneDotClassName[tone]);
}
