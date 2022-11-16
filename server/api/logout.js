export default defineEventHandler(async (event) => {
  delete event.node.req.session.user;

  return { statusCode: 200 };
});
