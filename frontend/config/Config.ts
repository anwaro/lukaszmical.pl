const env = (key: string, defaultValue = '') =>
    key in process.env ? process.env[key] : defaultValue;

export default {
    API_URL: env('API_URL'),
    NODE_ENV: env('NODE_ENV', 'development'),
};
