<template>
  <div class="form-control">
    <div class="input-group input-group-sm">
      <button class="btn btn-sm btn-square btn-primary" @click="onClickMinus">
        <MinusIcon class="w-4" />
      </button>
      <input
        ref="input"
        type="number"
        :value="value"
        step="1"
        min="0"
        max="9999"
        class="input input-sm input-bordered text-center w-16 px-2"
        @input="validate"
        @change="onChangeValue"
      />
      <button class="btn btn-sm btn-square btn-primary" @click="onClickPlus">
        <PlusIcon class="w-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
  import { PlusIcon, MinusIcon } from '@heroicons/vue/24/outline';

  const props = defineProps({
    value: {
      type: Number,
      default: 0,
    },
  });
  const emit = defineEmits(['change']);
  const input = ref(null);

  const onClickPlus = () => {
    input.value.stepUp();
    input.value.dispatchEvent(new Event('change'));
  };
  const onClickMinus = () => {
    input.value.stepDown();
    input.value.dispatchEvent(new Event('change'));
  };
  const validate = (e) => {
    e.target.value = e.target.value.slice(0, 4);
  };
  const onChangeValue = (e) => {
    emit('change', e.target.value);
  };
</script>

<style scoped>
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    appearance: textfield;
  }
</style>
