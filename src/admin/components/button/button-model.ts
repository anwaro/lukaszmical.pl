import {clsx} from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

const variantClassName: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary:
        'bg-transparent border-slate-200 text-slate-600 hover:bg-slate-50 ' +
        'dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
    danger: 'bg-rose-600 text-white',
};

export function buttonClassName(
    variant: ButtonVariant,
    size: 'md' | 'sm',
    className?: string,
) {
    return clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2',
        'border text-sm font-medium whitespace-nowrap no-underline',
        'cursor-pointer border-transparent transition-colors',
        'disabled:cursor-default disabled:opacity-60',
        'aria-disabled:cursor-default aria-disabled:opacity-60',
        'focus-visible:outline-2 focus-visible:outline-blue-500',
        'focus-visible:outline-offset-2',
        size === 'sm' && 'px-3 py-1.5 text-xs/4',
        variantClassName[variant],
        className,
    );
}
