<template>
  <div class="p-5">
    <div class="breadcrumbs text-sm py-0 mb-4">
      <ul>
        <li>
          <NuxtLink href="/">Home</NuxtLink>
        </li>
        <li
          v-for="(parentCategory, i) in item.category.parentCategories"
          :key="i"
        >
          <NuxtLink :to="`/categories/${parentCategory.slug}`">{{
            parentCategory.name
          }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="`/categories/${item.category.slug}`">{{
            item.category.name
          }}</NuxtLink>
        </li>
        <li>{{ item.name }}</li>
      </ul>
    </div>
    <div class="flex">
      <div class="w-1/2">
        <div class="grid grid-cols-2 gap-5">
          <div
            v-for="(image, index) in item.images"
            class="rounded-lg overflow-hidden"
          >
            <img
              :src="image"
              alt="Two each of gray, white, and black shirts laying flat."
              class="h-full w-full object-cover object-center hover:scale-105 ease-in duration-200"
              @click="() => openImageModel(item.images, index)"
            />
          </div>
        </div>
      </div>
      <div class="divider divider-horizontal" />
      <div class="w-1/2">
        <h1 class="text-2xl font-medium">
          {{ item.name }}
        </h1>
        <div v-if="starChecked" class="rating rating-sm rating-half">
          <input type="radio" name="rating-10" class="rating-hidden" />
          <input
            v-for="key in 10"
            type="radio"
            name="rating-10"
            class="bg-yellow-400 mask mask-star"
            :class="key % 2 == 1 ? 'mask-half-1' : 'mask-half-2'"
            :checked="key == starChecked ? true : false"
            disabled
          />
        </div>
        <div v-if="starChecked == 0" class="rating rating-sm">
          <input
            type="radio"
            name="rating-1"
            class="rating-hidden"
            checked
            disabled
          />
          <input
            v-for="star in 5"
            type="radio"
            name="rating-1"
            class="mask mask-star bg-yellow-400"
            disabled
          />
        </div>
        <div class="divider mt-0 mb-2" />
        <div class="mb-3">
          <p class="text-xl leading-none">
            <span class="font-medium">{{
              priceRange.map((p) => $n(p, 'currency', 'en-US')).join(' - ')
            }}</span>
            <span v-if="discountPercentage > 0" class="inline">
              <del class="text-xs text-slate-500 ml-1">
                {{
                  $n((subItem || item).inventory?.mrp || 0, 'currency', 'en-US')
                }}
              </del>
              <span class="badge badge-success text-white ml-1">
                {{ $n(discountPercentage, { maximumFractionDigits: 0 }) }}%
                OFF</span
              >
            </span>
          </p>
          <small v-if="taxType" class="text-slate-500">
            <span class="capitalize">{{ taxType }}</span> of all taxes
          </small>
        </div>
        <div
          v-for="attributeGroup in item.attributesGroup"
          :key="attributeGroup.slug"
          class="mb-3"
        >
          <p class="text-lg font-medium mb-2">{{ attributeGroup.name }}</p>
          <div class="grid grid-cols-5 gap-3">
            <label
              v-for="attributeOption in attributeGroup.options"
              :key="attributeOption.slug"
              class="relative cursor-pointer border rounded bg-base-100 p-4 shadow"
            >
              <p class="overflow-hidden text-ellipsis">
                {{ attributeOption.label }}
              </p>
              <input
                type="radio"
                :name="attributeGroup.slug"
                :value="attributeOption.value"
                class="absolute h-0 w-0 appearance-none"
                @change="onChangeAttribute"
              />
              <span
                class="hidden absolute inset-0 border rounded border-success bg-success bg-opacity-10"
              >
              </span>
            </label>
          </div>
        </div>
        <div class="flex items-center">
          <NuxtLink
            v-if="cartItem"
            class="btn btn-primary gap-2 mr-3"
            to="/checkout"
          >
            Go to Cart
            <ArrowRightIcon class="w-4" />
          </NuxtLink>
          <button
            v-else
            class="btn btn-primary gap-2 mr-3"
            :disabled="!(item.inventory || subItem)"
            @click="addToCart"
          >
            <ShoppingBagIcon class="w-4" /> Add to Cart
          </button>
          <button
            v-if="userStore.user"
            class="btn btn-outline gap-2"
            @click="(event) => toggleWishlist(item._id, event)"
          >
            <HeartIcon v-if="wishlistStatus" class="w-5 text-red-500" />
            <HeartIcon v-else class="w-5" />{{
              wishlistStatus ? 'Wishlisted' : 'Wishlist'
            }}
          </button>
        </div>
        <div class="divider mt-3 mb-1" />
        <div v-if="item.description" class="my-3">
          <p class="text-xl font-medium mb-2">Product Details</p>
          <p class="w-4/5">{{ item.description }}</p>
        </div>
        <Review :itemId="item._id" @star-event="starCheckedStatus"></Review>
        <div class="modal" :class="imageModel.status ? 'modal-open' : null">
          <div
            class="modal-box w-7/12 max-w-5xl h-5/6 bg-gray-800 self-center flex"
          >
            <div class="w-1/12 flex items-center">
              <ChevronLeftIcon
                class="w-10 h-10 text-white cursor-pointer"
                :class="
                  imageModel.index == 0
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
                "
                @click="() => changeImageModel('PREV')"
              >
              </ChevronLeftIcon>
            </div>
            <div class="w-10/12 h-full flex justify-center items-center">
              <img
                :src="imageModel.image[imageModel.index]"
                class="w-full h-full object-contain select-none"
              />
            </div>
            <div class="w-1/12 grid justify-items-end relative">
              <div class="flex items-center">
                <ChevronRightIcon
                  class="w-10 h-10 text-white cursor-pointer"
                  :class="
                    imageModel.index == imageModel.image.length - 1
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  "
                  @click="() => changeImageModel('NEXT')"
                >
                </ChevronRightIcon>
              </div>
              <XMarkIcon
                class="w-10 h-10 text-white absolute cursor-pointer"
                @click="closeImageModel"
              ></XMarkIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useCartStore } from '@/store/cart';
  import { useToastStore } from '@/store/toast';
  import { useUserStore } from '@/store/user';
  import { ShoppingBagIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
  import {
    ChevronLeftIcon,
    ChevronRightIcon,
    HeartIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/solid';

  const cartStore = useCartStore();
  const toastStore = useToastStore();
  const userStore = useUserStore();
  const route = useRoute();
  const imageModel = ref({
    status: false,
    image: [],
  });
  const starChecked = ref(0);
  const wishlistStatus = ref(false);

  const { data: item } = await useFetch('/api/v1/items', {
    headers: useRequestHeaders(['cookie', 'host']),
    params: { slug: [route.params.slug] },
    transform(response) {
      return response.data.results[0];
    },
  });

  const priceRange = computed({
    get() {
      const priceArr = [];

      if (subItem.value) {
        priceArr.push(subItem.value.inventory.price);
      } else {
        if (item.value.inventory?.price) {
          priceArr.push(item.value.inventory.price);
        }

        priceArr.concat(
          item.value.subItems?.reduce((arr, si) => {
            if (si.inventory?.price) {
              arr.push(si.inventory.price);
            }

            return arr;
          }, priceArr) || []
        );
      }

      return priceArr.length > 1
        ? [...new Set([Math.min(...priceArr), Math.max(...priceArr)])]
        : priceArr;
    },
  });
  const discountPercentage = computed({
    get() {
      const price =
        subItem.value?.inventory?.price || item.value.inventory?.price;
      const mrp = subItem.value?.inventory?.mrp || item.value.inventory?.mrp;

      if (price < mrp) {
        return 100 - (price / mrp) * 100;
      }

      return 0;
    },
  });
  const taxType = computed({
    get() {
      let taxType = null;

      if (item.value.inventory?.taxes.length) {
        taxType = item.value.inventory?.taxes[0].type;
      }

      return taxType;
    },
  });
  const subItem = computed({
    get() {
      return item.value.subItems.find((si) =>
        si.attributes.every(
          (attribute) =>
            selectedAttributes.value[attribute.parentAttribute.slug] ===
            attribute.value
        )
      );
    },
  });
  const cartItem = computed({
    get() {
      return cartStore.filterCartItem(subItem.value || item.value).item;
    },
  });

  const selectedAttributes = ref({});

  const onChangeAttribute = (e) => {
    selectedAttributes.value[e.target.name] = e.target.value;
  };

  const addToCart = async (event) => {
    event.target.disabled = true;
    event.target.classList.add('loading');
    await cartStore.changeItemQuantity({
      id: subItem.value?._id || item.value._id,
      locationId:
        subItem.value?.inventory.locationId || item.value.inventory.locationId,
      quantity: 1,
    });
    event.target.disabled = false;
    event.target.classList.remove('loading');
  };

  const starCheckedStatus = (star) => {
    let count = 0;

    for (var i = 1; i <= 10; i++) {
      if (star == count + 1 && i % 2 == 0) starChecked.value = i;
      if (star > count && star < count + 1 && i % 2 == 1) starChecked.value = i;
      if (i % 2 == 0) count++;
    }
  };

  let openImageModel = (img, index) => {
    imageModel.value = {
      status: true,
      image: img,
      index: index,
    };
  };

  let closeImageModel = () => {
    imageModel.value.status = false;
  };

  let changeImageModel = (button) => {
    let temp = imageModel.value;

    if (button === 'NEXT' && temp.index < temp.image.length - 1) {
      temp.index = temp.index + 1;
      imageModel.value = temp;
    }
    if (button === 'PREV' && temp.index !== 0) {
      temp.index = temp.index - 1;
      imageModel.value = temp;
    }
  };

  let toggleWishlist = async (itemId, event) => {
    if (!wishlistStatus.value) {
      event.target.disabled = true;
      let { data: wishlist } = await useFetch('/api/v1/user/wishlist', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        body: {
          itemId: itemId,
        },
        transform(response) {
          return response.data;
        },
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();
          nuxtApp?.$onResponseError(response);
        },
      });
      event.target.disabled = false;

      if (wishlist?.value.includes(itemId)) {
        toastStore.showToast('Added to your Wishlist');
        wishlistStatus.value = true;
      }
    } else {
      event.target.disabled = true;
      let { data: response } = await useFetch(
        `/api/v1/user/wishlist/${itemId}`,
        {
          method: 'DELETE',
          headers: useRequestHeaders(['cookie']),
          onResponseError: ({ response }) => {
            const nuxtApp = useNuxtApp();
            nuxtApp?.$onResponseError(response);
          },
        }
      );
      event.target.disabled = false;

      if (response?.value.statusCode === 200) {
        toastStore.showToast('Removed from your Wishlist.');
        wishlistStatus.value = false;
      }
    }
  };

  const { data: wishlistData } = await useFetch('/api/v1/user/wishlist', {
    headers: useRequestHeaders(['cookie']),
    transform(response) {
      return response.data;
    },
  });

  if (wishlistData.value?.results.length) {
    let wishListArray = wishlistData.value.results.map((e) => e._id);
    wishlistStatus.value = wishListArray.includes(item.value._id);
  }
</script>

<style scoped>
  input[type='radio']:checked + span {
    display: block;
  }
</style>
