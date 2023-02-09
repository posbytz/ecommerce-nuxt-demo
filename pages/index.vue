<template>
  <div>
    <div class="carousel h-96 bg-slate-200">
      <div
        v-if="storeStore.settings.store?.banners"
        v-for="(banner, i) in storeStore.settings.store?.banners"
        :id="`slide-${i + 1}`"
        class="carousel-item w-full"
      >
        <img :src="banner.file_path" :alt="banner.name" class="w-full" />
      </div>
    </div>
    <div class="p-5">
      <template v-if="brands?.length">
        <div class="divider">
          <h3 class="text-3xl">Explore Crush-worthy Brands</h3>
        </div>
        <div class="grid grid-cols-5 my-10">
          <NuxtLink v-for="brand in brands" :to="`/brand/${brand.slug}`">
            <div
              class="card card-compact indicator w-52 bg-base-100 border hover:shadow-xl"
            >
              <figure class="h-48">
                <img
                  :src="brand.logoUrl"
                  :alt="brand.name"
                  class="w-full object-cover"
                />
              </figure>
              <div class="card-body">
                <p class="text-lg font-medium text-center leading-none">
                  {{ brand.name }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </template>
      <template v-if="categories?.results.length">
        <div class="divider mb-8">
          <h3 class="text-3xl">Shop by Category</h3>
        </div>
        <div class="grid grid-cols-5">
          <NuxtLink
            v-for="category in categories.results"
            :to="`/categories/${category.slug}`"
            class="indicator cursor-pointer pb-5"
          >
            <div
              class="card card-compact indicator w-52 bg-base-100 border hover:shadow-xl"
            >
              <figure class="h-48">
                <img
                  :src="category.images[0]"
                  :alt="category.name"
                  class="w-full object-cover"
                />
              </figure>
              <div class="card-body">
                <p class="text-lg font-medium text-center leading-none">
                  {{ category.name }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </template>
      <div class="text-end mx-12">
        <button
          v-if="categoryCount < categories?.pagination.totalResults"
          @click="loadMoreCategories"
          class="mt-3 px-8 py-2 bg-rose-500 text-white duration-300 hover:bg-rose-700 rounded"
        >
          Load more
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useStoreStore } from '@/store/store';

  const storeStore = useStoreStore();
  const categoryCount = ref(20);
  let bannerScrollTimer = null;

  const { data: categories } = await useFetch('/api/v1/categories', {
    headers: useRequestHeaders(['cookie', 'host']),
    query: { limit: categoryCount },
    transform: (response) => {
      return response.data;
    },
  });

  const { data: brands } = await useFetch('/api/v1/brands', {
    headers: useRequestHeaders(['cookie', 'host']),
    query: { page: 1, limit: 20 },
    transform: (response) => {
      return response.data.results;
    },
  });

  onMounted(() => {
    scrollBanners();
  });

  onUnmounted(() => {
    clearInterval(bannerScrollTimer);
  });

  const scrollBanners = () => {
    let index = 1;
    const slideLength = document.querySelectorAll('.carousel-item').length;

    bannerScrollTimer = setInterval(() => {
      const carousel = document.querySelector('.carousel');

      if (index === slideLength) {
        carousel.scroll({ left: 1000 * -index });
        index = 1;
      } else {
        carousel.scroll({ left: 1000 * index });
        index++;
      }
    }, 5000);
  };

  const loadMoreCategories = async () => {
    if (categoryCount.value < categories.value?.pagination.totalResults) {
      categoryCount.value += 20;
    }
  };
</script>
