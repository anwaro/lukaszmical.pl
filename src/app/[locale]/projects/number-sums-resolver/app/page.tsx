import React from 'react';

import dynamic from 'next/dynamic';

const PageNumberSumsResolver = dynamic(
    () =>
        import('@/ui/pages/project/number-sums-resolver/number-sums-resolver').then(
            (comp) => comp.PageNumberSumsResolver,
        ),
    {
        ssr: false,
        loading: () => null,
    },
);

export default async function Page() {
    return <PageNumberSumsResolver />;
}
