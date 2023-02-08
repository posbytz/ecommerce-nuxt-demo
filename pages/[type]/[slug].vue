<template>
  <div class="px-5 pt-5">
    <div class="breadcrumbs text-sm py-0 mb-3">
      <ul>
        <li>
          <NuxtLink href="/">Home</NuxtLink>
        </li>
        <li
          v-if="category"
          v-for="(parentCategory, i) in category.parentCategories"
          :key="i"
        >
          <NuxtLink :to="`/categories/${parentCategory.slug}`">{{
            parentCategory.name
          }}</NuxtLink>
        </li>
        <li>{{ category ? category.name : brand?.results[0].name }}</li>
      </ul>
    </div>
    <div class="flex items-center mb-3">
      <h1 class="inline text-2xl">
        {{ category ? category.name : brand?.results[0].name }}
      </h1>
      <p class="inline text-slate-500">
        <span class="mx-2">-</span>{{ items?.pagination.totalResults || 0 }}
        Items
      </p>
    </div>
    <div class="flex justify-between items-center mb-3">
      <p class="font-semibold">Filters</p>
      <div class="form-control">
        <label class="input-group">
          <span>Sort by:</span>
          <select
            class="select select-sm select-bordered"
            @change="onChangeSortBy"
          >
            <option>Recommended</option>
            <option
              :value="JSON.stringify({ 'sort[createdAt]': '-1' })"
              :selected="route.query['sort[createdAt]'] === '-1'"
            >
              What's new
            </option>
            <option>Popularity</option>
            <option
              :value="JSON.stringify({ 'sort[inventories.price]': '1' })"
              :selected="route.query['sort[inventories.price]'] === '1'"
            >
              Price low to high
            </option>
            <option
              :value="JSON.stringify({ 'sort[inventories.price]': '-1' })"
              :selected="route.query['sort[inventories.price]'] === '-1'"
            >
              Price high to low
            </option>
            <option>Customer rating</option>
          </select>
        </label>
      </div>
    </div>
    <div class="flex border-t">
      <div
        class="w-1/5 sticky top-16 overflow-auto border-r py-5 pr-5"
        style="max-height: calc(100vh - 64px)"
      >
        <template v-if="category && category.subCategories.length">
          <p class="font-medium mb-2">Sub-Categories</p>
          <div
            v-for="subCategory in category.subCategories"
            :key="subCategory._id"
            class="form-control"
            :class="{ 'mb-1': i < category.subCategories.length - 1 }"
          >
            <label class="label justify-start cursor-pointer p-0">
              <input type="checkbox" class="checkbox checkbox-xs mr-3" />
              <span class="label-text">{{ subCategory.name }}</span>
            </label>
          </div>
          <div class="divider my-2" />
        </template>
        <template v-if="items?.filters.brand.length && type !== 'brand'">
          <p class="font-medium mb-2">Brand</p>
          <div
            v-for="(brand, i) in items.filters.brand"
            :key="brand._id"
            class="form-control"
            :class="{ 'mb-1': i < items.filters.brand.length - 1 }"
          >
            <label class="label justify-start cursor-pointer p-0">
              <input
                type="checkbox"
                name="brandId"
                class="checkbox checkbox-xs mr-3"
                :value="brand._id"
                @change="onChangeFilters"
              />
              <span class="label-text">{{ brand.name }}</span>
              <span class="text-slate-400 text-2xs ml-1"
                >({{ brand.count }})</span
              >
            </label>
          </div>
          <div class="divider my-2" />
        </template>
        <template v-if="items?.filters.price.length">
          <p class="font-medium mb-2">Price</p>
          <div
            v-for="(priceRange, i) in items.filters.price"
            :key="`${priceRange._id.min}-${priceRange._id.max}`"
            class="form-control"
            :class="{ 'mb-1': i < items.filters.price.length - 1 }"
          >
            <label class="label justify-start cursor-pointer p-0">
              <input
                type="checkbox"
                name="price"
                class="checkbox checkbox-xs mr-3"
                :value="
                  JSON.stringify([priceRange._id.min, priceRange._id.max])
                "
                @change="onChangeFilters"
              />
              <span class="label-text"
                >{{ $n(priceRange._id.min || 0, 'currency', 'en-US') }} to
                {{ $n(priceRange._id.max || 0, 'currency', 'en-US') }}</span
              >
              <span class="text-slate-400 text-2xs ml-1"
                >({{ priceRange.count }})</span
              >
            </label>
          </div>
          <div class="divider my-2" />
        </template>
        <template v-if="items?.filters.color.length">
          <p class="font-medium mb-2">Color</p>
          <div
            v-for="(color, i) in items.filters.color"
            :key="color._id"
            class="form-control"
            :class="{ 'mb-1': i < items.filters.color.length - 1 }"
          >
            <label class="label justify-start cursor-pointer p-0">
              <input
                type="checkbox"
                name="attributes[color]"
                class="checkbox checkbox-xs mr-3"
                :value="color._id"
                @change="onChangeFilters"
              />
              <span class="label-text">{{ color.name }}</span>
              <span class="text-slate-400 text-2xs ml-1"
                >({{ color.count }})</span
              >
            </label>
          </div>
          <div class="divider my-2" />
        </template>
        <template v-if="items?.filters.size.length">
          <p class="font-medium mb-2">Size</p>
          <div
            v-for="(size, i) in items.filters.size"
            :key="size._id"
            class="form-control"
            :class="{ 'mb-1': i < items.filters.size.length - 1 }"
          >
            <label class="label justify-start cursor-pointer p-0">
              <input
                type="checkbox"
                name="attributes[size]"
                class="checkbox checkbox-xs mr-3"
                :value="size._id"
                @change="onChangeFilters"
              />
              <span class="label-text">{{ size.name }}</span>
              <span class="text-slate-400 text-2xs ml-1"
                >({{ size.count }})</span
              >
            </label>
          </div>
        </template>
      </div>
      <div v-if="items" class="w-4/5 py-5 pl-5">
        <div class="grid grid-cols-4 gap-x-4 gap-y-8">
          <ItemCard v-for="item in items.results" :key="item.id" :item="item" />
        </div>
        <Pagination :options="items.pagination" @change="refreshItems" />
      </div>
    </div>
  </div>
</template>

<script setup>
  const route = useRoute();
  const router = useRouter();
  const { type, slug } = route.params;

  const { data: category } =
    type !== 'brand' &&
    (await useFetch('/api/v1/categories', {
      headers: useRequestHeaders(['cookie']),
      params: { slug: [slug] },
      transform(response) {
        return response.data.results[0];
      },
    }));

  const { data: brand } =
    type === 'brand' &&
    (await useFetch('/api/v1/brands', {
      headers: useRequestHeaders(['cookie']),
      query: { slug: [slug] },
      transform(response) {
        return response.data;
      },
    }));

  const { data: items, refresh: refreshItems } = await useFetch(
    '/api/v1/items',
    {
      headers: useRequestHeaders(['cookie']),
      onRequest({ request, options }) {
        if (type === 'brand') {
          options.params = {
            brandId: brand?.value.results[0]._id,
            ...route.query,
          };
        } else {
          options.params = {
            categoryId: category?.value._id,
            ...route.query,
          };
        }
      },
      transform(response) {
        return response.data;
      },
    }
  );

  const onChangeSortBy = async (event) => {
    const query = { ...route.query };
    const sortKey = Object.keys(query).find((k) => k.startsWith('sort['));
    const sortValue = JSON.parse(event.target.value);

    delete query[sortKey];
    Object.assign(query, sortValue);
    await router.push({ query });
    refreshItems();
  };

  const onChangeFilters = async (event) => {
    const query = { ...route.query };

    if (query[event.target.name]) {
      delete query[event.target.name];
    } else {
      Object.keys(query).forEach((k) => {
        if (k.startsWith(`${event.target.name}[`)) {
          delete query[k];
        }
      });
    }

    let selectedOptions = [
      ...document.querySelectorAll(`input[name='${event.target.name}']`),
    ].reduce((arr, el) => {
      if (el.checked) {
        arr.push(el.value);
      }

      return arr;
    }, []);

    if (selectedOptions.length) {
      switch (event.target.name) {
        case 'price':
          selectedOptions = selectedOptions.map((o) => JSON.parse(o)).flat();
          query['price[$gte]'] = Math.min(...selectedOptions);
          query['price[$lte]'] = Math.max(...selectedOptions);

          break;
        default:
          query[event.target.name] = selectedOptions;

          break;
      }
    }

    await router.push({ query });
    refreshItems();
  };
</script>
