<template>
  <div
    class="navbar sticky top-0 bg-base-100 bg-opacity-70 backdrop-blur shadow-md lg:px-5 z-10 max-lg:w-full lg:justify-between"
  >
    <div class="max-lg:navbar-start flex-none">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden px-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            @click="showDropdown"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </label>
        <ul
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          ref="dropdownRef"
        >
          <li
            v-for="(category, i) in categories?.slice(0, 6)"
            :key="i"
            @click="closeDropdown"
          >
            <NuxtLink :to="`/categories/${category.slug}`" class="">
              {{ category.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div class="avatar mr-2">
        <NuxtLink to="/" class="w-8 lg:w-12 rounded">
          <img :src="storeStore.logo" :alt="storeStore.brandName" />
        </NuxtLink>
      </div>
      <div class="hidden lg:tabs">
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
    <Search class="max-lg:hidden"></Search>
    <div class="lg:flex-none max-lg:navbar-end">
      <div
        class="lg:hidden btn btn-ghost btn-circle"
        @click="emit('toggleSearch', true)"
      >
        <MagnifyingGlassIcon class="w-5" />
      </div>
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
        <ul
          v-if="userStore.isLoggedIn"
          tabindex="0"
          class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li @click="$blurActiveElement">
            <NuxtLink to="/account/profile">Profile</NuxtLink>
          </li>
          <li @click="$blurActiveElement">
            <NuxtLink to="/account/addresses">Addresses</NuxtLink>
          </li>
          <li @click="$blurActiveElement">
            <NuxtLink to="/account/wishlist">Wishlist</NuxtLink>
          </li>
          <li @click="$blurActiveElement">
            <NuxtLink to="/account/orders">Orders</NuxtLink>
          </li>
          <li @click="$blurActiveElement">
            <a @click="userStore.logout">Logout</a>
          </li>
        </ul>
        <div
          v-else
          tabindex="0"
          class="dropdown-content card card-compact w-64 mt-3 p-2 shadow bg-base-100"
        >
          <div class="card-body">
            <h3 class="font-medium">Welcome</h3>
            <p>To access account and manage orders</p>
            <a
              href="/auth"
              class="btn btn-outline btn-primary"
              @click="$blurActiveElement"
            >
              Login / Signup
            </a>
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
    UserCircleIcon,
  } from '@heroicons/vue/24/outline';
  import { useStoreStore } from '@/store/store';
  import { useCartStore } from '@/store/cart';
  import { useUserStore } from '@/store/user';

  const gridColsLength = 4;
  const storeStore = useStoreStore();
  const cartStore = useCartStore();
  const userStore = useUserStore();
  const dropdownRef = ref(null);
  const emit = defineEmits(['toggleSearch']);

  const { data: categories } = await useFetch('/api/v1/categories', {
    headers: useRequestHeaders(['cookie', 'host']),
    transform: (response) => {
      return response.data.results;
    },
  });

  const closeDropdown = () => {
    dropdownRef.value.classList.add('hidden');
  };
  const showDropdown = () => {
    dropdownRef.value.classList.remove('hidden');
  };
</script>
