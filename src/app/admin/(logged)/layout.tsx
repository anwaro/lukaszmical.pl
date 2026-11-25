import LayoutAuthenticated from '@/admin/layouts/layout-authenticated';
import {MediaLibraryProvider} from '@/admin/media/media-library-provider';
import {getMediaAssets} from '@/services/media/media-store';
// The content preview is rendered by a server action, which can only send the
// client components (links, images) that the page's own server graph knows of.
// Importing the block library here puts them in the manifest of every admin page.
import '@/ui/site/content-mdx';

export default async function Layout({children}: PWC) {
    const assets = await getMediaAssets();

    return (
        <MediaLibraryProvider initialAssets={assets}>
            <LayoutAuthenticated>{children}</LayoutAuthenticated>
        </MediaLibraryProvider>
    );
}
