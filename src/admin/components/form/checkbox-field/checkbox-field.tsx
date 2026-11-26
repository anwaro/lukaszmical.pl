import {cloneElement, ReactElement} from 'react';

import {clsx} from 'clsx';

type Props = {
    // The checkbox input.
    children: ReactElement<{className?: string}>;
    label?: string;
    className?: string;
};

// A checkbox drawn as a switch.
export const CheckboxField = ({children, label, className}: Props) => {
    return (
        <label
            className={clsx(
                'relative inline-flex cursor-pointer items-center gap-2',
                'text-sm font-medium text-slate-700 dark:text-slate-300',
                className,
            )}
        >
            {cloneElement(children, {
                className: clsx(
                    'peer pointer-events-none absolute opacity-0',
                    children.props.className,
                ),
            })}
            <span
                className={clsx(
                    'flex h-5 w-9 shrink-0 items-center rounded-full bg-slate-100',
                    'p-0.5 ring-1 ring-slate-200 transition-colors ring-inset',
                    'peer-checked:bg-blue-600 peer-checked:ring-0',
                    'peer-focus-visible:outline-2 peer-focus-visible:outline-blue-500',
                    'peer-focus-visible:outline-offset-2 dark:bg-slate-800',
                    'dark:ring-slate-700',
                )}
                aria-hidden
            >
                <span
                    className={clsx(
                        'size-4 rounded-full bg-white shadow-sm transition-transform',
                        'peer-checked:translate-x-4',
                    )}
                />
            </span>
            <span>{label}</span>
        </label>
    );
};
