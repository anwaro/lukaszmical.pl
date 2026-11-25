import React from 'react';

import {LoaderCircle} from 'lucide-react';

export const MdxFieldLoader = () => {
    return (
        <div
            className="flex items-center justify-center text-(--ink-muted)"
            style={{minHeight: 500}}
        >
            <LoaderCircle className="kv-spin size-8" strokeWidth={1.8} />
        </div>
    );
};
