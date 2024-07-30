import {ProjectLocale, ProjectLocalesList} from '@/types/supabase/projects';

export const params = (url: URL) => {
    let minFile = process.env.NODE_ENV === 'production';
    let slug: string | undefined = url.searchParams.get('slug') || undefined;
    const minFileParam = url.searchParams.get('min');
    const locale = (url.searchParams.get('locale') || 'en') as ProjectLocale;

    if (minFileParam) {
        minFile = ['1', 'true'].includes(minFileParam);
    }

    return {
        slug,
        minFile,
        locale: ProjectLocalesList.includes(locale) ? locale : 'en',
    };
};
