<template>
  <div class="modal" :class="modal.searchModal ? 'modal-open' : ''">
    <div class="modal-box w-9/10 h-2/4">
      <Search></Search>
      <div class="p-6 absolute bottom-0 right-0">
        <button class="btn btn-error btn-sm" @click="modal.hideSearchToast">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useModalStore } from '../store/modal';

  const modal = useModalStore();
</script>
