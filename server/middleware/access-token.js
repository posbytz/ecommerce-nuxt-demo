export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  if (
    config.nodeEnv !== 'development' &&
    !event.node.req.url.startsWith('/__nuxt_error')
  ) {
    if (
      !event.node.req.session.apiAccessToken ||
      event.node.req.session.apiAccessToken.created_at +
        event.node.req.session.apiAccessToken.expires_in * 1000 >=
        Date.now()
    ) {
      try {
        const response = await $fetch('/oauth2/token', {
          baseURL: config.ecommerceApiDomain,
          method: 'POST',
          body: {
            client_id: config.ecommerceApiClientId,
            client_secret: config.ecommerceApiClientSecret,
            grant_type: 'client_credentials',
            scope:
              'country:read store:read category:read item:read user:read user:write cart:read cart:write order:read order:write search:read',
            provision_key: config.ecommerceApiProvisionKey,
            authenticated_userid: config.ecommerceStoreCode,
          },
        });

        event.node.req.session.apiAccessToken = {
          ...response,
          created_at: Date.now(),
        };
      } catch (err) {
        console.error('access-token middleware', err.data);
        throw createError(err);
      }
    }
  }
});
