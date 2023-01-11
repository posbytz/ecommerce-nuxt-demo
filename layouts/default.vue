<template>
<Head>
  <Link rel='icon' :href="store?.favicon" />
</Head>
  <div>
    <Navbar />
    <slot />
    <Footer />
  </div>
</template>

<script setup>
import { useStoreStore } from '../store/store'

const store = useStoreStore()
</script>


