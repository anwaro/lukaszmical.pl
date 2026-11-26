import {clsx, ClassValue} from 'clsx';

// The shared look of every text input, select and textarea in the admin
// forms. `text-base sm:text-sm`: iOS Safari zooms the page in whenever a
// focused control's computed font-size is under 16px, below the `sm`
// breakpoint only — so the desktop size (14px) stays untouched.
const baseClassNames = [
    'box-border',
    'w-full',
    'max-w-full',
    'rounded-lg',
    'border',
    'border-slate-200',
    'bg-white',
    'px-3',
    'py-2',
    'text-base',
    'text-slate-900',
    'shadow-none',
    'placeholder:text-slate-400',
    'focus:border-blue-500',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500/20',
    'sm:text-sm',
    'dark:border-slate-700',
    'dark:bg-slate-800',
    'dark:text-white',
];

export function fieldInputClassName(className?: ClassValue) {
    return clsx(...baseClassNames, className);
}

// A field passed through `FormField` always receives `fieldInputClassName`
// as its className, even when (like `MdxField`) it draws its own box and
// has no use for it — this removes exactly those tokens, keeping whatever
// else the caller added.
export function stripFieldInputClassName(className?: string) {
    const kept = (className ?? '')
        .split(/\s+/)
        .filter((token) => token && !baseClassNames.includes(token));
    return kept.join(' ');
}
