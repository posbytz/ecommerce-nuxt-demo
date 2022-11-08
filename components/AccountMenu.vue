<template>
  <ul class="menu bg-base-100 w-56">
    <li class="menu-title">
      <span>Account</span>
    </li>
    <li>
      <NuxtLink
        to="/account/profile"
        class="rounded"
        :class="{ active: tab === 'profile' }"
      >
        Profile
      </NuxtLink>
    </li>
    <li>
      <NuxtLink
        to="/account/addresses"
        class="rounded"
        :class="{ active: tab === 'addresses' }"
      >
        Addresses
      </NuxtLink>
    </li>
    <li class="menu-title">
      <span>Orders</span>
    </li>
    <li>
      <NuxtLink
        to="/account/orders"
        class="rounded"
        :class="{ active: tab === 'orders' }"
      >
        Orders
      </NuxtLink>
    </li>
    <li class="menu-title">
      <span>Legal</span>
    </li>
    <li><NuxtLink to="/terms-of-use">Terms Of Use</NuxtLink></li>
    <li><NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink></li>
  </ul>
</template>

<script setup>
  const route = useRoute();
  const tab = route.path.split('/').pop();
</script>
