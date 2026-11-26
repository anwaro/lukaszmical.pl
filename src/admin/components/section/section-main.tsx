import React, {ReactNode} from 'react';

type Props = {
    children: ReactNode;
};

// The content column of an admin page (up to 1152px wide).
export default function SectionMain({children}: Props) {
    return (
        <main className="mx-auto box-border w-full max-w-6xl px-4 pt-6 pb-16 sm:px-6">
            {children}
        </main>
    );
}
