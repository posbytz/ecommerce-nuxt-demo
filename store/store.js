import { defineStore } from 'pinia';

export const useStoreStore = defineStore('store', {
  id: 'store-store',
  state: () => ({
    store: null,
  }),
  actions: {
    async init() {
      const event = useRequestEvent();

      return $fetch('/api/v1/store', {
        headers: useRequestHeaders(['cookie', 'host']),
        params: { domain: event.node.req.headers.host },
      })
        .then((response) => {
          event.node.req.session.store = response.data;
          this.$patch({ store: response.data });
        })
        .catch(() => {
          delete event.node.req.session.store;
          this.$reset();
        });
    },
  },
  getters: {
    brandName: (state) =>
      state.store?.business?.brandName || state.store?.business?.name,
    logo: (state) =>
      state.store?.settings?.store?.general?.logo_img_url ||
      state.store?.business?.logoUrl ||
      '/images/logo.svg',
    settings: (state) => state.store?.settings,
    paymentMethods: (state) =>
      state.store?.paymentMethods
        .filter((pm) => pm.active)
        .sort((a, b) => a.position - b.position),
  },
});
