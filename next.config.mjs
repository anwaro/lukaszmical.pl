import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/projects/:name',
                destination: '/api/projects/show',
            },
        ];
    },
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
