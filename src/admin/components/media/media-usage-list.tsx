import React from 'react';

import {MediaUsage} from '@/services/media/media-usage-scanner';

type Props = {
    usages: MediaUsage[];
};

// The entries a used asset is referenced from, as links — shown after a
// blocked delete or move.
export function MediaUsageList({usages}: Props) {
    return (
        <>
            {usages.map((usage, index) => (
                <React.Fragment
                    key={`${usage.entryId}-${usage.field}-${usage.locale ?? ''}`}
                >
                    {index > 0 && ', '}
                    <a href={usage.href} className="underline">
                        {usage.slug} ({usage.field}
                        {usage.locale ? `, ${usage.locale}` : ''})
                    </a>
                </React.Fragment>
            ))}
        </>
    );
}
