const withSass = require('@zeit/next-sass');

module.exports = withSass({
    cssModules: true,
    typescript: {
        ignoreDevErrors: true,
    },
});
