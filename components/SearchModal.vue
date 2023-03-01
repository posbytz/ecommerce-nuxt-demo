<template>
  <div class="modal" :class="props.visible ? 'modal-open' : ''">
    <div class="modal-box w-full md:min-w-full min-h-full rounded-none">
      <Search @toggleSearch="emit('toggleSearch', false)"></Search>
      <div class="btm-nav">
        <button
          class="bg-error font-semibold uppercase text-lg"
          @click="emit('toggleSearch', false)"
        >
          <span class="btm-nav-label">Cancel</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  const emit = defineEmits(['toggleSearch']);
  const props = defineProps({
    visible: {
      type: Boolean,
      required: false,
    },
  });
</script>
