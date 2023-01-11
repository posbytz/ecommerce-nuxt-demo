export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const params = getQuery(event);
  const body = method === 'GET' ? undefined : await readBody(event);

  if (method === 'DELETE') {
    delete event.node.req.session[params.key];
  }

  if (method === 'PUT') {
    event.node.req.session[params.key] = ''
  }

  return { statusCode: 200 };
});
