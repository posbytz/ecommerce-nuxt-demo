import { useStoreStore } from '@/store/store';
import { useCartStore } from '@/store/cart';
import { useUserStore } from '@/store/user';

export default defineNuxtPlugin(async ({ $pinia }) => {
  const { req } = useRequestEvent();

  if (!req.url.startsWith('/__nuxt_error')) {
    const storeStore = useStoreStore($pinia);
    const cartStore = useCartStore($pinia);
    const userStore = useUserStore($pinia);

    try {
      await storeStore.init();
      await cartStore.init();
      await userStore.init();
    } catch (err) {
      throw createError(err);
    }
  }
});
