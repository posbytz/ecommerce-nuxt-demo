<template>
  <div
    class="navbar sticky top-0 bg-base-100 bg-opacity-70 backdrop-blur shadow-md px-5 z-10"
  >
    <div class="flex-none">
      <div class="avatar mr-2">
        <NuxtLink to="/" class="w-12 rounded">
          <img
            src="https://posbytz-qa.s3.amazonaws.com/stores/411/logo.png"
            :alt="storeStore['brandName']"
          />
        </NuxtLink>
      </div>
      <div class="tabs">
        <div
          v-for="(category, i) in categories?.slice(0, 6)"
          :key="i"
          class="dropdown dropdown-hover"
        >
          <NuxtLink
            :to="`/categories/${category.slug}`"
            class="tab tab-lg tab-bordered border-b-4 border-transparent hover:border-base-content text-base-content capitalize"
          >
            {{ category.name }}
          </NuxtLink>
          <div
            v-if="category.subCategories.length"
            tabindex="0"
            class="dropdown-content card card-compact rounded-none bg-base-100 w-max p-2 border shadow-md"
          >
            <div class="card-body">
              <div
                class="grid gap-4"
                :class="{
                  'grid-cols-1': category.subCategories.length === 1,
                  'grid-cols-2': category.subCategories.length === 2,
                  'grid-cols-3': category.subCategories.length === 3,
                  'grid-cols-4':
                    category.subCategories.length >= gridColsLength,
                }"
              >
                <div
                  v-for="(subCategory, j) in category.subCategories"
                  :key="j"
                  :class="{
                    'border-t': j + 1 > gridColsLength,
                    'pt-3': j + 1 > gridColsLength,
                  }"
                >
                  <NuxtLink
                    :to="`/categories/${subCategory.slug}`"
                    class="link link-base link-hover font-medium capitalize block mb-2"
                  >
                    {{ subCategory.name }}
                  </NuxtLink>
                  <NuxtLink
                    v-for="(childCategory, k) in subCategory.subCategories"
                    :key="k"
                    :to="`/categories/${childCategory.slug}`"
                    class="link link-hover block capitalize"
                    :class="{
                      'mb-1': k + 1 < subCategory.subCategories.length,
                    }"
                  >
                    {{ childCategory.name }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grow px-4">
      <div class="relative form-control w-full">
        <MagnifyingGlassIcon
          class="absolute h-4 w-4 top-2 left-2 text-slate-500"
        />
        <input
          ref="searchInput"
          type="search"
          placeholder="Search for products, brands and more"
          class="input input-sm bg-base-200 focus:bg-base-100 pl-8"
          @input="search"
        />
        <div
          v-if="
            searchResult.categories?.length > 0 ||
            searchResult.items?.length > 0
          "
          class="absolute dropdown dropdown-open left-0 right-0 top-9"
        >
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 w-full"
          >
            <template v-if="searchResult.categories?.length">
              <li class="menu-title">
                <span>Categories</span>
              </li>
              <li v-for="category in searchResult.categories">
                <a
                  @click="onClickSearchResult(`/categories/${category.slug}`)"
                  >{{ category.name }}</a
                >
              </li>
            </template>
            <template v-if="searchResult.items?.length">
              <li class="menu-title">
                <span>Items</span>
              </li>
              <li v-for="item in searchResult.items">
                <NuxtLink>{{ item.name }}</NuxtLink>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
    <div class="flex-none">
      <NuxtLink to="/checkout" class="btn btn-ghost btn-circle">
        <div class="indicator">
          <ShoppingCartIcon class="w-5" />
          <span
            v-if="cartStore.cart?.items.length"
            class="badge badge-sm badge-primary indicator-item text-white"
            >{{ cartStore.cart.items.length }}</span
          >
        </div>
      </NuxtLink>
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <UserCircleIcon class="w-6" />
        </label>
        <!-- <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a class="justify-between">
              Profile
              <span class="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul> -->
        <div
          tabindex="0"
          class="dropdown-content card card-compact w-64 mt-3 p-2 shadow bg-base-100"
        >
          <div class="card-body">
            <h3 class="font-medium">Welcome</h3>
            <p>To access account and manage orders</p>
            <NuxtLink
              to="/auth"
              class="btn btn-outline btn-primary"
              @click="$blurActiveElement"
            >
              Login / Signup
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    MagnifyingGlassIcon,
    ShoppingCartIcon,
  } from '@heroicons/vue/24/outline/index.js';
  import { UserCircleIcon } from '@heroicons/vue/24/outline';
  import { useStoreStore } from '~~/stores/store';
  import { useDebounceFn } from '@vueuse/core';
  import { useCartStore } from '~~/stores/cart';

  const router = useRouter();
  const gridColsLength = 4;
  const storeStore = useStoreStore();
  const cartStore = useCartStore();
  const { data: categories } = await useFetch('/api/v1/categories', {
    headers: useRequestHeaders(['cookie', 'host']),
    transform: (response) => {
      return response.data.results;
    },
  });
  const searchInput = ref(null);
  const searchResult = ref({});
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