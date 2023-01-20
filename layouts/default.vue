<template>
<Head>
  <Link rel='icon' :href="store?.favicon" />
</Head>
  <div>
    <Navbar />
    <slot />
    <Toast></Toast>
    <Footer />
  </div>
</template>

<script setup>
import { useStoreStore } from '../store/store'

const store = useStoreStore()
</script>


