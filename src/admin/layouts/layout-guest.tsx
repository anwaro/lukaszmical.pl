import React, {ReactNode} from 'react';

import {ThemeToggle} from '@/admin/theme/theme-toggle';

type Props = {
    children: ReactNode;
};

// A centred column for the sign-in screens.
export default function LayoutGuest({children}: Props) {
    return (
        <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
            <div className="absolute top-3 right-3">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-sm">{children}</div>
        </div>
    );
}
