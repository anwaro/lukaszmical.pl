import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // async rewrites() {
    //     return [
    //         {
    //             source: '/:locale(en|pl)/projects/:name',
    //             destination: '/api/projects/show',
    //         },
    //     ];
    // },
    // transpilePackages: ['next-mdx-remote'],
    async redirects() {
        return [
            {
                source: '/project/:name',
                destination: '/projects/:name',
                permanent: true,
            },
        ];
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb',
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: `${process.env.R2_BUCKET_PUBLIC_URL}`.replace(
                    'https://',
                    '',
                ),
                port: '',
                pathname: '**',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
