import LayoutAuthenticated from '@/admin/layouts/layout-authenticated';
// The content preview is rendered by a server action, which can only send the
// client components (links, images) that the page's own server graph knows of.
// Importing the block library here puts them in the manifest of every admin page.
import '@/ui/site/content-mdx';

export default async function Layout({children}: PWC) {
    return <LayoutAuthenticated>{children}</LayoutAuthenticated>;
}
