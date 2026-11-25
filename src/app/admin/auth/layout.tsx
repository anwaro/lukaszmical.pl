import LayoutGuest from '@/admin/layouts/layout-guest';

export default async function Layout({children}: PWC) {
    return <LayoutGuest>{children}</LayoutGuest>;
}
