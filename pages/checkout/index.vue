<template>
  <div>
    <div class="navbar bg-base-100 border-b px-20">
      <div class="flex-none">
        <div class="avatar mr-2">
          <NuxtLink to="/" class="w-12 rounded">
            <img
              src="https://posbytz-qa.s3.amazonaws.com/stores/411/logo.png"
              :alt="storeStore['brandName']"
            />
          </NuxtLink>
        </div>
      </div>
      <div class="grow place-content-center px-4">
        <ul class="steps">
          <li data-content="✓" class="step step-primary w-28">Cart</li>
          <li data-content="" class="step step-primary w-28">Address</li>
          <li data-content="" class="step w-28">Payment</li>
        </ul>
      </div>
      <div class="flex-none">
        <ShieldCheckIcon class="w-8 text-primary mr-1" />
        <p class="text-slate-500">100% SECURE</p>
      </div>
    </div>
    <div v-if="cartStore.cart?.items.length" class="flex mx-48">
      <div class="w-4/6 p-3">
        <div class="flex items-center justify-between mb-3">
          <p class="font-medium">{{ cartStore.cart.items.length }} Items</p>
          <label
            for="remove-item-modal"
            class="btn btn-xs btn-link modal-button no-underline hover:no-underline px-0"
          >
            Remove
          </label>
        </div>
        <div
          v-for="(cartItem, index) in cartStore.cart.items"
          :key="index"
          class="card card-side rounded border bg-base-100"
          :class="{
            'mb-4': index < cartStore.cart.items.length - 1,
          }"
        >
          <div class="avatar">
            <div class="w-32">
              <img src="https://placeimg.com/120/120/arch" alt="Movie" />
            </div>
          </div>
          <div class="card-body justify-between p-4">
            <div class="flex justify-between">
              <div class="leading-none">
                <h2 class="font-medium">
                  {{ cartItem.name }}
                </h2>
                <small class="text-slate-400">{{
                  cartItem.category.name
                }}</small>
              </div>
              <label
                for="remove-item-modal"
                class="btn btn-xs btn-link text-error p-0"
                @click="itemToRemove = cartItem"
              >
                <XMarkIcon class="w-6" />
              </label>
            </div>
            <div class="card-actions items-center justify-between">
              <div class="leading-none">
                <p>
                  <span class="font-medium">{{
                    $n(cartItem.price, 'currency', 'en-US')
                  }}</span>
                  <small v-if="cartItem.mrp > cartItem.price">
                    <del class="text-xs text-slate-500 ml-1">
                      {{ $n(cartItem.mrp, 'currency', 'en-US') }}
                    </del>
                  </small>
                </p>
                <small
                  v-if="cartItem.mrp > cartItem.price"
                  class="text-xs text-success"
                >
                  {{ $n(cartItem.mrp - cartItem.price, 'currency', 'en-US') }}
                  OFF
                </small>
              </div>
              <Stepper
                :key="index"
                :value="cartItem.quantity"
                @change="(value) => onChangeQuantity(cartItem, +value)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="divider divider-horizontal m-0" />
      <div class="w-2/6 p-3">
        <ul class="menu border mb-4">
          <li>
            <a><TagIcon class="w-5" />Apply Coupon</a>
          </li>
        </ul>
        <p class="font-medium mb-2">
          Price Details ({{ cartStore.cart.items.length }} Items)
        </p>
        <p class="flex justify-between font-light">
          <span>Subtotal</span>
          <span>{{
            $n(cartStore.cart.bill.subtotal, 'currency', 'en-US')
          }}</span>
        </p>
        <p class="flex justify-between font-light">
          <span>Tax</span>
          <span>{{ $n(cartStore.cart.bill.tax, 'currency', 'en-US') }}</span>
        </p>
        <p class="flex justify-between font-light">
          <span>Discount</span>
          <span>{{
            $n(cartStore.cart.bill.discount, 'currency', 'en-US')
          }}</span>
        </p>
        <p class="flex justify-between font-light">
          <span>Charges</span>
          <span>{{ $n(cartStore.cart.bill.charge, 'currency', 'en-US') }}</span>
        </p>
        <p class="flex justify-between font-light">
          <span>Round Off</span>
          <span>{{
            $n(cartStore.cart.bill.roundOff, 'currency', 'en-US')
          }}</span>
        </p>
        <div class="divider my-2" />
        <p class="flex justify-between font-medium mb-4">
          <span>Total Amount</span>
          <span>{{ $n(cartStore.cart.bill.total, 'currency', 'en-US') }}</span>
        </p>
        <button class="btn btn-primary w-full">Place Order</button>
      </div>
    </div>
    <div v-else class="flex min-h-[calc(100vh-81px)] text-center">
      <div class="m-auto">
        <img
          src="~/assets/images/cart.svg"
          alt="Cart"
          class="m-auto w-64 mb-4"
        />
        <h1 class="text-2xl font-medium mt-2">Hey, it feels so light!</h1>
        <p class="text-slate-400 mb-4">
          There is nothing in your cart. Let's add some items
        </p>
        <button class="btn btn-outline btn-primary">
          Add items from wishlist
        </button>
      </div>
    </div>
    <div class="flex items-center justify-between border-t px-20 py-4">
      <div>
        <div class="flex w-fit border p-1">
          <LockClosedIcon class="w-8 text-slate-400" />
          <div>
            <p class="text-xs text-primary">256-bit</p>
            <p class="text-xs">SSL</p>
          </div>
        </div>
      </div>
      <a href="" class="float-right">Need Help? Contact Us</a>
    </div>
    <input type="checkbox" id="remove-item-modal" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box">
        <div class="flex justify-between">
          <h3 class="font-medium text-lg">
            Remove
            {{
              itemToRemove
                ? itemToRemove.variation.name
                : `${cartStore.cart?.items.length} items`
            }}
          </h3>
          <label
            ref="removeItemModalCloseRef"
            for="remove-item-modal"
            class="btn btn-sm btn-ghost btn-circle text-error p-0"
            @click="itemToRemove = null"
          >
            <XMarkIcon class="w-6" />
          </label>
        </div>
        <p class="py-4">
          Are you sure you want to remove
          {{
            itemToRemove
              ? itemToRemove.variation.name
              : `${cartStore.cart?.items.length} items`
          }}
          from cart?
        </p>
        <div class="modal-action mt-0">
          <a href="#" class="btn btn-ghost text-error" @click="removeItem"
            >Remove</a
          >
          <a href="#" class="btn btn-ghost text-primary">Move to Wishlist</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useStoreStore } from '~~/stores/store';
  import { ShieldCheckIcon } from '@heroicons/vue/24/solid';
  import { useCartStore } from '@/stores/cart';
  import {
    LockClosedIcon,
    TagIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/outline';

  definePageMeta({
    layout: false,
  });

  const storeStore = useStoreStore();
  const cartStore = useCartStore();
  const itemToRemove = ref(null);
  const removeItemModalCloseRef = ref(null);

  const onChangeQuantity = (cartItem, quantity) => {
    cartStore.changeItemQuantity({
      id: cartItem.variation._id,
      locationId: cartStore.cart.locationId,
      quantity,
    });
  };
  const removeItem = () => {
    if (itemToRemove.value) {
      cartStore.removeItem(itemToRemove.value._id);
    } else {
      cartStore.delete();
    }

    removeItemModalCloseRef.value?.click();
  };
</script>
