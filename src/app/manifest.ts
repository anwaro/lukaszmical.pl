import type {MetadataRoute} from 'next';

import {siteName} from '@/utils/seo';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteName,
        short_name: siteName,
        description: 'Personal website and portfolio of Łukasz Micał.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
            {
                src: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
            {src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
            {src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
        ],
    };
}
