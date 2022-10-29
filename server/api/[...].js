export default defineEventHandler(async (event) => {
  const method = useMethod(event);
  const headers = {
    'X-Api-Authorization': event.req.session.apiAccessToken?.access_token,
  };
  const params = useQuery(event);
  const body = method === 'GET' ? undefined : await useBody(event);

  if (process.env.NODE_ENV === 'development') {
    headers['x-authenticated-userid'] = 'M0001171';
  }

  try {
    const response = await $fetch(event.req.url.replace(/^\/api/, ''), {
      baseURL: process.env.ECOMMERCE_API_DOMAIN,
      method,
      headers,
      params,
      body,
    });

    if (params.sessionStoreKey) {
      event.req.session[params.sessionStoreKey] = response.data;
    }

    return response;
  } catch (err) {
    throw createError({
      statusCode: err.response.status,
      data: err.data,
    });
  }
});
