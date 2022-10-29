export default defineEventHandler(async (event) => {
  if (!event.req.url.startsWith('/__nuxt_error')) {
    if (
      !event.req.session.apiAccessToken ||
      event.req.session.apiAccessToken.created_at +
        event.req.session.apiAccessToken.expires_in * 1000 >=
        Date.now()
    ) {
      try {
        const { data } = await $fetch('/v1/auth/token', {
          baseURL: process.env.ECOMMERCE_API_DOMAIN,
          method: 'POST',
          body: {
            clientId: process.env.ECOMMERCE_API_CLIENT_ID,
            clientSecret: process.env.ECOMMERCE_API_CLIENT_SECRET,
            scope:
              'country:read store:read category:read item:read user:read user:write cart:read cart:write order:read order:write search:read',
            storeCode: process.env.ECOMMERCE_STORE_CODE,
          },
        });

        event.req.session.apiAccessToken = {
          ...data,
          created_at: Date.now(),
        };
      } catch (err) {
        throw createError(err);
      }
    }
  }
});
