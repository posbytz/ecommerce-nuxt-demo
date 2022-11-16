export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) {
    const event = useRequestEvent();

    if (to.path !== '/auth' && !event.node.req.session?.user?._id) {
      return navigateTo(`/auth?next=${event.node.req.url}`);
    } else if (to.path === '/auth' && event.node.req.session?.user?._id) {
      return navigateTo('/');
    }
  }
});
