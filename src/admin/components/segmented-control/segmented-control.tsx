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
        <fieldset className={clsx('kv-field m-0 min-w-0 border-0 p-0', className)}>
            <legend className={hideLabel ? 'sr-only' : 'kv-field-label'}>
                {label}
            </legend>
            <div
                className={clsx('kv-seg', size === 'sm' && 'kv-seg-sm')}
                style={{
                    gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
                }}
            >
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="kv-seg-opt"
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
