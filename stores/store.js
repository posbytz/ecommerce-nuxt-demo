import { defineStore } from 'pinia';

export const useStoreStore = defineStore('store', {
  id: 'store-store',
  state: () => ({
    store: null,
  }),
  actions: {
    init() {
      const event = useRequestEvent();

      return $fetch('/api/v1/store', {
        headers: useRequestHeaders(['cookie', 'host']),
        params: { domain: event.req.headers.host },
      })
        .then((response) => {
          event.req.session.store = response.data;
          this.$patch({ store: response.data });
        })
        .catch(() => {
          delete event.req.session.store;
          this.$reset();
        });
    },
  },
  getters: {
    brandName: (state) =>
      state.store?.business?.brandName || state.store?.business?.name,
    settings: (state) => state.store?.settings,
  },
});
