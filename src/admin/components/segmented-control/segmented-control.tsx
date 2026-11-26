'use client';

import React, {useId} from 'react';

import {clsx} from 'clsx';

type Option<Value extends string> = {value: Value; label: string; title?: string};

type Props<Value extends string> = {
    label: string;
    // The label is the accessible name; hide it where the context names it.
    hideLabel?: boolean;
    options: Option<Value>[];
    value: Value;
    onChange: (value: Value) => void;
    size?: 'md' | 'sm';
    className?: string;
};

// One of 2–3 options in a grid of equal tiles (radio inputs underneath).
export function SegmentedControl<Value extends string>({
    label,
    hideLabel = false,
    options,
    value,
    onChange,
    size = 'md',
    className,
}: Props<Value>) {
    const name = useId();

    return (
        <fieldset className={clsx('m-0 min-w-0 border-0 p-0', className)}>
            <legend
                className={
                    hideLabel
                        ? 'sr-only'
                        : 'mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400'
                }
            >
                {label}
            </legend>
            <div
                className={clsx('grid gap-2', size === 'sm' && 'text-xs/4')}
                style={{
                    gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
                }}
            >
                {options.map((option) => (
                    <label
                        key={option.value}
                        className={clsx(
                            'cursor-pointer rounded-lg border border-slate-200 bg-transparent',
                            'text-center text-sm font-medium text-slate-500 transition-colors',
                            'hover:bg-slate-50 has-checked:border-blue-500',
                            'has-checked:bg-blue-50 has-[:checked]:text-blue-700',
                            'has-focus-visible:outline-2 has-[:focus-visible]:outline-blue-500',
                            'has-focus-visible:outline-offset-2 dark:border-slate-700',
                            'dark:text-slate-400 dark:hover:bg-slate-800',
                            'dark:has-checked:bg-blue-500/10 dark:has-[:checked]:text-blue-300',
                            size === 'sm' ? 'px-3 py-1.5' : 'px-3 py-2',
                        )}
                        title={option.title}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={option.value === value}
                            onChange={() => onChange(option.value)}
                            className="sr-only"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </fieldset>
    );
}
