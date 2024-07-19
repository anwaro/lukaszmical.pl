import {string} from '@/utils/string';

export const params = (url: URL) => {
    let minFile = process.env.NODE_ENV === 'production';
    let slug: string | undefined = url.searchParams.get('slug') || undefined;
    const minFileParam = url.searchParams.get('min');

    if (!slug) {
        slug = string.match(url.pathname, '/projects/:slug')?.slug;
    }

    if (minFileParam) {
        minFile = ['1', 'true'].includes(minFileParam);
    }

    return {
        slug,
        minFile,
    };
};
