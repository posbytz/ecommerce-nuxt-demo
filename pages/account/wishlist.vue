<template>
  <div class="px-5 pt-5">
    <h1 class="text-2xl mb-4">Your Account</h1>
    <div class="flex border-t">
      <div
        class="w-1/5 sticky top-16 overflow-auto border-r py-3"
        style="max-height: calc(100vh - 64px)"
      >
        <AccountMenu />
      </div>
      <div class="w-4/5 py-5 pl-5">
        <div class="flex items-center justify-between mb-4">
          <p class="text-xl">Wishlist</p>
        </div>
        <div v-if="wishlist?.results.length" class="grid grid-cols-4">
          <ItemCard
            v-for="(item, key) in wishlist.results"
            :item="item"
            class="mb-10"
          ></ItemCard>
        </div>
        <div v-else class="flex min-h-[calc(100vh-300px)] text-center py-4">
          <div class="m-auto">
            <h1 class="text-2xl font-medium mt-2 uppercase">YOUR WISHLIST IS EMPTY</h1>
            <p class="text-slate-400 mb-4">
              Add items that you like to your wishlist.
            </p>
            <NuxtLink to="/" class="btn btn-outline btn-primary uppercase"
              >Continue Shopping
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const { data: wishlist } = await useFetch('/api/v1/user/wishlist', {
    headers: useRequestHeaders(['cookie', 'host']),
    transform(response) {
      return response.data;
    },
  });
</script>
