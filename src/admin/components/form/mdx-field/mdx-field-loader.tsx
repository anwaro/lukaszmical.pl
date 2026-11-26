import React from 'react';

import {LoaderCircle} from 'lucide-react';

export const MdxFieldLoader = () => {
    return (
        <div
            className="flex items-center justify-center text-slate-500 dark:text-slate-400"
            style={{minHeight: 500}}
        >
            <LoaderCircle className="size-8 animate-spin" strokeWidth={1.8} />
        </div>
    );
};
