import React from 'react';

import {Locale} from '@/types/locale';
import {ContentMdx} from '@/ui/site/content-mdx';
import {SiteShell} from '@/ui/site/site-shell';

type Props = {
    // Block source (MDX) — the whole page between the header and the footer.
    source: string;
    locale: Locale;
};

export function PageStatic({source, locale}: Props) {
    return (
        <SiteShell>
            <ContentMdx source={source} locale={locale} />
        </SiteShell>
    );
}
