'use client';

import React from 'react';

import dynamic from 'next/dynamic';

const PageMonogramResolver = dynamic(
    () =>
        import('@/ui/pages/project/monogram-resolver/monogram-resolver').then(
            (comp) => comp.PageMonogramResolver,
        ),
    {
        ssr: false,
        loading: () => null,
    },
);

export default function Page() {
    return <PageMonogramResolver />;
}
