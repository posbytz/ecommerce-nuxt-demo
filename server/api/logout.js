export default defineEventHandler(async (event) => {
  delete event.req.session.user;

  return { statusCode: 200 };
});
