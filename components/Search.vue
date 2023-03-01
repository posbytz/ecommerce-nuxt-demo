<template>
  <div class="grow-0 lg:grow lg:px-4">
    <div class="relative form-control w-full">
      <MagnifyingGlassIcon
        class="absolute h-6 lg:h-4 w-5 lg:w-6 top-2 left-2 text-slate-500"
      />
      <input
        ref="searchInput"
        type="search"
        placeholder="Search for products, brands and more"
        class="input input-sm bg-base-200 focus:bg-base-100 pl-10 lg:pl-8 max-lg:py-5"
        @input="search"
      />
      <div
        v-if="
          searchResult.categories?.length > 0 || searchResult.items?.length > 0
        "
        class="absolute dropdown dropdown-open left-0 right-0 top-12 lg:top-9"
        @click="emit('toggleSearch')"
      >
        <ul
          tabindex="0"
          class="dropdown-content menu p-2 lg:shadow bg-base-100 w-full"
        >
          <template v-if="searchResult.categories?.length">
            <li class="menu-title">
              <span>Categories</span>
            </li>
            <li v-for="category in searchResult.categories">
              <a @click="onClickSearchResult(`/categories/${category.slug}`)">
                {{ category.name }}
              </a>
            </li>
          </template>
          <template v-if="searchResult.items?.length">
            <li class="menu-title">
              <span>Items</span>
            </li>
            <li v-for="item in searchResult.items">
              <a @click="onClickSearchResult(`/items/${item.slug}`)">
                {{ item.name }}
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
  import { useDebounceFn } from '@vueuse/core';

  const searchInput = ref(null);
  const searchResult = ref({});
  const router = useRouter();
  const emit = defineEmits(['toggleSearch']);

  const search = useDebounceFn(async (event) => {
    const q = event.target.value;

    if (q) {
      const response = await $fetch('/api/v1/search', {
        headers: useRequestHeaders(['cookie']),
        params: { q },
      });

      searchResult.value = response.data;
    } else {
      searchResult.value = {};
    }
  }, 500);

  const onClickSearchResult = (url) => {
    searchInput.value.value = '';
    searchResult.value = {};
    router.push(url);
  };
</script>