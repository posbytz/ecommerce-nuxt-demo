<template>
  <NuxtLink :to="`/items/${item.slug}`" class="indicator cursor-pointer">
    <span
      v-if="discountPercentage > 0"
      class="indicator-item indicator-bottom indicator-center badge text-2xs"
      >{{ discountPercentage }}%&nbsp;OFF</span
    >
    <div
      class="card card-compact indicator w-52 bg-base-100 border hover:shadow-xl max-md:w-72"
    >
      <figure class="h-56 max-md:h-72">
        <img
          :src="item.images[0]"
          :alt="item.name"
          class="h-full object-contain"
        />
      </figure>
      <div class="card-body">
        <h2 class="text-lg font-medium leading-none">{{ item.name }}</h2>
        <p>
          <span>{{
            priceRange.map((p) => $n(p, 'currency', 'en-US')).join(' - ')
          }}</span>
          <del
            v-if="item.inventory?.mrp"
            class="text-2xs text-slate-400 ml-1"
            >{{ $n(item.inventory?.mrp, 'currency', 'en-US') }}</del
          >
        </p>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  });
  const item = computed({
    get() {
      return props.item;
    },
  });
  const priceRange = computed({
    get() {
      const priceArr = [];

      if (props.item.inventory?.price) {
        priceArr.push(props.item.inventory.price);
      }

      priceArr.concat(
        props.item.subItems?.reduce((arr, si) => {
          if (si.inventory?.price) {
            arr.push(si.inventory.price);
          }

          return arr;
        }, priceArr) || []
      );

      return priceArr.length > 1
        ? [...new Set([Math.min(...priceArr), Math.max(...priceArr)])]
        : priceArr;
    },
  });
  const discountPercentage = computed({
    get() {
      if (item.value.inventory?.price < item.value.inventory?.mrp) {
        return Math.floor(
          100 - (item.value.inventory?.price / item.value.inventory?.mrp) * 100
        );
      }

      return 0;
    },
  });
</script>
