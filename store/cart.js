import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  id: 'cart-store',
  state: () => ({
    cart: null,
  }),
  actions: {
    async init() {
      const { req } = useRequestEvent();

      this.cart = req.session.cart || null;
    },
    async changeItemQuantity(data) {
      const response = await $fetch('/api/v1/carts/item', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        params: {
          cartId: this.cart?._id,
          sessionStoreKey: 'cart',
        },
        body: data,
        transform(response) {
          return response.data;
        },
      });

      this.$patch({ cart: response.data });
    },
    async removeItem(id) {
      const response = await $fetch(`/api/v1/carts/items/${id}`, {
        method: 'DELETE',
        headers: useRequestHeaders(['cookie']),
        params: {
          cartId: this.cart?._id,
          sessionStoreKey: 'cart',
        },
        transform(response) {
          return response.data;
        },
      });

      this.$patch({ cart: response.data });
    },
    async delete() {
      await $fetch('/api/v1/carts', {
        method: 'DELETE',
        headers: useRequestHeaders(['cookie']),
        params: {
          cartId: this.cart?._id,
          sessionStoreKey: 'cart',
        },
        transform(response) {
          return response.data;
        },
      });

      this.cart = null;
    },
    async destroy() {
      this.$reset();
      await $fetch('/api/session', {
        method: 'DELETE',
        headers: useRequestHeaders(['cookie']),
        params: { key: 'cart' },
      });
    },
  },
  getters: {
    filterCartItem: (state) => {
      return (item) => {
        const data = { index: -1 };
        const cartItemIndex = state.cart?.items.findIndex((i) => {
          return (
            item._id === i.variation._id &&
            (item.inventory.price || i.price) === i.price &&
            (item.groups || [])
              .map((g) => g.itemId)
              .filter((m) => !i.groups.map((g) => g.itemId).includes(m))
              .length === 0
          );
        });

        if (cartItemIndex > -1) {
          data.index = cartItemIndex;
          data.item = state.cart.items[cartItemIndex];
        }

        return data;
      };
    },
  },
});
