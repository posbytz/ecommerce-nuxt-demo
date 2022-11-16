export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const method = getMethod(event);
  const headers = {
    'X-Api-Authorization': event.node.req.session.apiAccessToken?.access_token,
    Authorization: event.node.req.session.user?.accessToken
      ? `${event.node.req.session.user.tokenType} ${event.node.req.session.user.accessToken}`
      : undefined,
  };
  const params = getQuery(event);
  const body = method === 'GET' ? undefined : await readBody(event);

  if (config.nodeEnv === 'development') {
    headers['x-authenticated-userid'] = config.ecommerceStoreCode;
  }

  try {
    const response = await $fetch(event.node.req.url.replace(/^\/api/, ''), {
      baseURL: config.ecommerceApiDomain,
      method,
      headers,
      params,
      body,
    });

    if (params.sessionStoreKey) {
      if (typeof event.node.req.session[params.sessionStoreKey] === 'object') {
        Object.assign(
          event.node.req.session[params.sessionStoreKey],
          response.data
        );
      } else {
        event.node.req.session[params.sessionStoreKey] = response.data;
      }
    }

    return response;
  } catch (err) {
    if (params.sessionStoreKey && err.response.status === 403) {
      event.node.req.session[params.sessionStoreKey] = err.data.data;
    }

    throw createError({
      statusCode: err.response.status,
      data: err.data,
    });
  }
});
