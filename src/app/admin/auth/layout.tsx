import LayoutGuest from '@/admin/layouts/Guest';

export default async function Layout({children}: PWC) {
    return <LayoutGuest>{children}</LayoutGuest>;
}
