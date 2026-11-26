import React from 'react';

type Props = {
    title: string;
    description?: string;
    children?: React.ReactNode;
};

// Title row of a card, with actions on the right.
export function CardHeader({title, description, children}: Props) {
    return (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
                <h2 className="text-base/6 font-semibold text-slate-900 dark:text-white">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
}
