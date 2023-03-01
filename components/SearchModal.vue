<template>
  <div class="modal" :class="modal.searchModal ? 'modal-open' : ''">
    <div class="modal-box w-full md:min-w-full min-h-full rounded-none">
      <Search></Search>
      <div class="btm-nav">
        <button
          class="bg-error font-semibold uppercase text-lg"
          @click="modal.hideSearchToast"
        >
          <span class="btm-nav-label">Cancel</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useModalStore } from '../store/modal';

  const modal = useModalStore();
</script>
