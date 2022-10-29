import { useStoreStore } from '~~/stores/store';
import { useCartStore } from '@/stores/cart';

export default defineNuxtPlugin(async ({ $pinia }) => {
  const { req } = useRequestEvent();

  if (!req.url.startsWith('/__nuxt_error')) {
    const storeStore = useStoreStore($pinia);
    const cartStore = useCartStore($pinia);

    try {
      await storeStore.init();
      await cartStore.init();
    } catch (err) {
      throw createError(err);
    }
  }
});
