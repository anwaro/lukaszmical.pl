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
            {
                source: '/projects/show/:name',
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
    // The routes that render bundled interactive projects read files from
    // `public/projects` with `fs` at runtime. Vercel serves `public/` as static
    // assets and does not include it in the serverless function bundle by
    // default, so force-trace it into those routes.
    outputFileTracingIncludes: {
        '/*/projects/*': ['./public/projects/**/*'],
        '/api/projects/*': ['./public/projects/**/*'],
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
