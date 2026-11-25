import React, {ReactNode} from 'react';

type Props = {
    title: string;
    description?: ReactNode;
    // Actions on the right: one primary button at most.
    children?: ReactNode;
};

export function PageHeader({title, description, children}: Props) {
    return (
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
                <h1 className="kv-page-title">{title}</h1>
                {description && <p className="kv-body mt-1">{description}</p>}
            </div>
            {children && <div className="flex items-center gap-2">{children}</div>}
        </header>
    );
}
