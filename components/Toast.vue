<template>
    <div class="toast toast-end">
          <div class="alert alert-success rounded px-5">
            <div>
              <CheckCircleIcon class="w-8"/>
              <span>{{ props.message }}</span>
            </div>
          </div>
        </div>
</template>

<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  message: {
    type: String,
    required: true
  }
})
</script>