<template>
  <template v-if="props.options.lastPage > 1">
    <div class="divider" />
    <div class="btn-group justify-center">
      <button
        class="btn btn-sm btn-outline btn-primary"
        :disabled="props.options.currentPage === 1"
        @click="onClickBtn(props.options.currentPage - 1)"
      >
        <ChevronLeftIcon class="w-4 text-base" />
      </button>
      <template v-if="props.options.currentPage < 10">
        <button
          v-for="i in [
            ...Array(
              props.options.lastPage < 10 ? props.options.lastPage : 10
            ).keys(),
          ]"
          class="btn btn-sm btn-outline btn-primary"
          :class="{
            'btn-active': props.options.currentPage === i + 1,
          }"
          @click="onClickBtn(i + 1)"
        >
          {{ i + 1 }}
        </button>
      </template>
      <template v-else>
        <button class="btn btn-sm btn-outline btn-primary">1</button>
        <button class="btn btn-sm btn-outline btn-primary" disabled>...</button>
        <button
          v-for="i in [
            ...Array(
              props.options.currentPage + 4 > props.options.lastPage
                ? 5 + props.options.lastPage - props.options.currentPage
                : 9
            ).keys(),
          ]"
          class="btn btn-sm btn-outline btn-primary"
          :class="{
            'btn-active':
              props.options.currentPage === props.options.currentPage + i - 4,
          }"
        >
          {{ props.options.currentPage + i - 4 }}
        </button>
      </template>
      <button
        class="btn btn-sm btn-outline btn-primary"
        :disabled="props.options.currentPage === props.options.lastPage"
        @click="onClickBtn(props.options.currentPage + 1)"
      >
        <ChevronRightIcon class="w-4 text-base" />
      </button>
    </div>
  </template>
</template>

<script setup>
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

  const props = defineProps({
    options: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['change']);
  const route = useRoute();
  const router = useRouter();

  const onClickBtn = async (page) => {
    await router.push({
      query: {
        ...route.query,
        page,
      },
    });
    emit('change', page);
  };
</script>
