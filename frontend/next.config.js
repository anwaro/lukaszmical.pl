const {i18n} = require('./next-i18next.config');

module.exports = {
    cssModules: true,
    i18n,
    async rewrites() {
        return [
            {
                source: '/projects/:name',
                destination: '/api/projects/show',
            },
            {
                source: '/assets/:path*',
                destination: '/api/projects/assets',
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
