export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) {
    const event = useRequestEvent();

    if (to.path !== '/auth' && !event.req.session?.user?._id) {
      return navigateTo(`/auth?next=${event.req.url}`);
    } else if (to.path === '/auth' && event.req.session?.user?._id) {
      return navigateTo('/');
    }
  }
});
