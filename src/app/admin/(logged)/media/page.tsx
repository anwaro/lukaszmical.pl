import React from 'react';

import {auth} from '@/utils/auth/auth';
import SectionMain from '@/admin/components/section/section-main';
import {PageHeader} from '@/admin/components/section/page-header';
import {Card} from '@/admin/components/card/card';
import {MediaLibraryView} from '@/admin/components/media/media-library-view';

export default async function PrivatePage() {
    await auth();

    return (
        <SectionMain>
            <PageHeader
                title="Biblioteka mediów"
                description="Pliki w zasobniku R2 — zmiany tutaj są widoczne od razu w polach obrazów."
            />
            <Card padding="lg">
                <MediaLibraryView />
            </Card>
        </SectionMain>
    );
}
