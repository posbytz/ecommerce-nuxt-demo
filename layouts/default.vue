<template>
  <Head>
    <Link rel="icon" :href="store?.favicon" />
  </Head>
  <div>
    <Navbar @toggleSearch="toggleSearch" />
    <slot />
    <SearchModal :visible="isVisible" @toggleSearch="toggleSearch" />
    <Toast></Toast>
    <Footer />
  </div>
</template>

<script setup>
  import { useStoreStore } from '../store/store';

  const store = useStoreStore();
  const isVisible = ref(null);

  const toggleSearch = (value) => {
    if (value) {
      isVisible.value = true;
      document.body.classList.add('overflow-hidden');
    } else {
      isVisible.value = false;
      document.body.classList.remove('overflow-hidden');
    }
  };
</script>
