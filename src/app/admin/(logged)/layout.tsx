import LayoutAuthenticated from '@/admin/layouts/Authenticated';

export default async function Layout({children}: PWC) {
    return <LayoutAuthenticated>{children}</LayoutAuthenticated>;
}
