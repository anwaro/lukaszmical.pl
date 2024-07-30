import {notFound} from 'next/navigation';

import {DashboardPage} from '@/admin/pages/dashboard';
import {auth} from '@/utils/supabase/auth';
import {ErrorPage} from '@/admin/pages/error';
import {FormsPage} from '@/admin/pages/forms';
import {LoginPage} from '@/admin/pages/login';
import {ProfilePage} from '@/admin/pages/profile';
import {TablesPage} from '@/admin/pages/tables';
import {UiPage} from '@/admin/pages/ui';

const pages = {
    dashboard: DashboardPage,
    error: ErrorPage,
    forms: FormsPage,
    login: LoginPage,
    profile: ProfilePage,
    tables: TablesPage,
    ui: UiPage,
};

type Props = {
    params: {
        page: keyof typeof pages;
    };
};

export default async function PrivatePage({params}: Props) {
    await auth();

    const Component = pages[params.page];

    if (!Component) {
        notFound();
    }

    return <Component />;
}
