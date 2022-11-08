import { defineStore } from 'pinia';
import { useCartStore } from './cart';

export const useOrderStore = defineStore('order', {
  id: 'order-store',
  state: () => ({
    order: null,
  }),
  actions: {
    async init() {
      const { req } = useRequestEvent();

      this.order = req.session.order || null;
    },
    placeOrder(data) {
      const cartStore = useCartStore();

      return $fetch('/api/v1/orders', {
        method: 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        params: {
          cartId: cartStore.cart._id,
          // sessionStoreKey: 'order',
        },
        body: data,
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();

          nuxtApp?.$onResponseError(response);
        },
      });
    },
  },
  getters: {},
});
