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
    transpilePackages: ['next-mdx-remote'],
    async redirects() {
        return [
            {
                source: '/project/:name',
                destination: '/projects/:name',
                permanent: false,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
