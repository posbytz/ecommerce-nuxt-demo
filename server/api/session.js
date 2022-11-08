export default defineEventHandler(async (event) => {
  const method = useMethod(event);
  const params = useQuery(event);
  const body = method === 'GET' ? undefined : await useBody(event);

  if (method === 'DELETE') {
    delete event.req.session[params.key];
  }

  return { statusCode: 200 };
});
