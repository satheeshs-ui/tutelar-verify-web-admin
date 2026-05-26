const env = import.meta.env;

const config = {
    BASE_URL: env.VITE_ENV_BASE_URL,
    LOCAL_URL: env.VITE_ENV_LOCAL_URL,
    S3_UPLOADER: {
        RECAPTCHA_SITE_KEY: env.VITE_ENV_RECAPTCHA_SITE_KEY,
        VITE_SOCKET_URL: env.VITE_ENV_SOCKET_URL,
    },
    GOOGLE_MAPS_KEY: env.VITE_ENV_GOOGLE_MAPS_API_KEY,
    CUSTOMER_URL: env.VITE_ENV_CUSTOMER_BASE_URL || "https://verify.tutelar.io",
    RECAPTCHA_SITE_KEY: env.VITE_ENV_RECAPTCHA_SITE_KEY,
};

export default config;
