<template>
    <div v-if="toastStore.toast" class="toast toast-end">
          <div class="alert alert-success rounded px-5">
            <div>
              <CheckCircleIcon class="w-8"/>
              <span>{{ toastStore.toast }}</span>
            </div>
          </div>
        </div>
</template>

<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import { useToastStore } from '../store/toast'

const toastStore = useToastStore()

</script>