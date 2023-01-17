import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    nodeEnv: process.env.NODE_ENV,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisDb: process.env.REDIS_DB,
    redisConnectionType: process.env.REDIS_CONNECTION_TYPE,
    sessionSecret: process.env.SESSION_SECRET,
    ecommerceStoreCode: process.env.ECOMMERCE_STORE_CODE,
    ecommerceApiDomain: process.env.ECOMMERCE_API_DOMAIN,
    ecommerceApiClientId: process.env.ECOMMERCE_API_CLIENT_ID,
    ecommerceApiClientSecret: process.env.ECOMMERCE_API_CLIENT_SECRET,
    ecommerceApiProvisionKey: process.env.ECOMMERCE_API_PROVISION_KEY,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsAccessSecret: process.env.AWS_SECRET_ACCESS_KEY,
    awsBucketName: process.env.AWS_BUCKET_NAME,
  },
  css: ['@/assets/css/overrides.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt' /* '@nuxt/content' */],
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json'),
        ],
      }),
    ],
  },
  build: {
    transpile: ['@heroicons/vue'],
  },
});
