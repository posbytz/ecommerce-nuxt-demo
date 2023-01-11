<template>
  <div>
    <div class="navbar bg-base-100 border-b px-20">
      <div class="flex-none">
        <div class="avatar mr-2">
          <NuxtLink to="/" class="w-12 rounded">
            <img :src="storeStore.logo" :alt="storeStore['brandName']" />
          </NuxtLink>
        </div>
      </div>
      <div class="grow place-content-center px-4">
        <ul class="steps">
          <li
            v-for="(stepInfo, i) in steps"
            :data-content="step > i ? '✓' : step === i ? '●' : ''"
            class="step w-28 cursor-pointer"
            :class="{
              'step-primary': step >= i,
            }"
            @click="step = i < step ? i : step"
          >
            {{ stepInfo.name }}
          </li>
        </ul>
      </div>
      <div class="flex-none">
        <ShieldCheckIcon class="w-8 text-primary mr-1" />
        <p class="text-slate-500">100% SECURE</p>
      </div>
    </div>
    <div v-if="cartStore.cart?.items.length" class="flex mx-48">
      <div class="w-4/6 px-3 pt-3 pb-5">
        <template v-if="step === 0">
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
            class="card card-side rounded border bg-base-100 drop-shadow"
            :class="{
              'mb-4': index < cartStore.cart.items.length - 1,
            }"
          >
            <div class="avatar">
              <div class="w-32">
                <img :src="cartItem?.image" :alt="`Product-${index+1}`" />
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
        </template>
        <template v-else-if="step === 1">
          <div class="flex items-center justify-between mb-3">
            <p class="font-medium">Select Delivery Address</p>
            <label
              for="address-modal"
              class="btn btn-sm btn-outline btn-primary"
            >
              Add New Address
            </label>
          </div>
          <div
            v-for="address in addresses"
            class="card rounded border bg-base-100 drop-shadow"
          >
            <div class="card-body capitalize p-4">
              <label class="flex items-center cursor-pointer">
                <input
                  v-model="deliveryAddressId"
                  type="radio"
                  name="delivery-address-id"
                  :value="address._id"
                  class="radio radio-primary mr-4"
                />
                <div>
                  <p class="flex items-center font-medium mb-2">
                    {{ address.contact?.name }}
                    <span
                      class="badge badge-sm badge-primary badge-outline ml-2"
                      >{{ address.annotation }}</span
                    >
                  </p>
                  <p class="text-sm text-slate-500">
                    {{
                      [
                        address.line,
                        address.area,
                        address.city,
                        address.state,
                        address.country,
                        address.zip,
                      ].join(', ')
                    }}
                  </p>
                  <p v-if="address.landmark" class="text-sm text-slate-500">
                    Landmark: {{ address.landmark }}
                  </p>
                  <p class="mt-3">
                    Contact: {{ address.contact?.mobile.number }}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </template>
        <template v-else-if="step === 2">
          <p class="font-medium mb-3">Choose Payment Mode</p>
          <div
            class="card min-h-[300px] rounded border bg-base-100 drop-shadow"
          >
            <div class="flex">
              <ul class="menu w-96 rounded-tl rounded-bl bg-base-100">
                <li
                  v-for="paymentMethod in storeStore.paymentMethods"
                  :class="{
                    active: selectedPaymentMethod.slug === paymentMethod.slug,
                    disabled: paymentMethod.slug !== 'cod',
                  }"
                >
                  <a
                    :class="{
                      active: selectedPaymentMethod.slug === paymentMethod.slug,
                    }"
                    >{{ paymentMethod.name }}</a
                  >
                </li>
              </ul>
              <div class="border-l p-4">
                <p class="font-medium mb-4">Pay on Delivery (Cash / UPI)</p>
                <p class="text-sm text-slate-400">
                  You can pay via Cash or UPI enabled app at the time of
                  delivery. Ask your delivery executive for these options.
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="divider divider-horizontal m-0" />
      <div class="w-2/6 p-3">
        <ul class="menu border mb-4">
          <li>
            <a> <TagIcon class="w-5" />Apply Coupon </a>
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
        <button
          ref="actionButtonRef"
          class="btn btn-primary w-full"
          @click="processOrder"
        >
          {{ steps[step].action }}
        </button>
      </div>
    </div>
    <div v-else class="flex min-h-[calc(100vh-81px)] text-center py-4">
      <div class="m-auto">
        <img src="/images/cart.svg" alt="Cart" class="m-auto w-64 mb-4" />
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
      <a href="#" class="float-right">Need Help? Contact Us</a>
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
    <AddressModal />
  </div>
</template>

<script setup>
  import {
    LockClosedIcon,
    TagIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/outline';
  import { ShieldCheckIcon } from '@heroicons/vue/24/solid';
  import { useStoreStore } from '@/store/store';
  import { useCartStore } from '@/store/cart';
  import { useUserStore } from '@/store/user';
  import { useOrderStore } from '@/store/order';

  definePageMeta({
    layout: false,
  });

  const router = useRouter();
  const storeStore = useStoreStore();
  const cartStore = useCartStore();
  const userStore = useUserStore();
  const orderStore = useOrderStore();

  const steps = [
    {
      name: 'Bag',
      action: 'Continue',
    },
    {
      name: 'Address',
      action: 'Place Order',
    },
    {
      name: 'Payment',
      action: 'Complete',
    },
  ];

  const actionButtonRef = ref(null);
  const step = ref(0);
  const itemToRemove = ref(null);
  const removeItemModalCloseRef = ref(null);
  const addresses = ref([]);
  const deliveryAddressId = ref(null);
  const selectedPaymentMethod = ref(
    storeStore.paymentMethods?.find((pm) => pm.slug === 'cod')
  );

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

  const processOrder = async (e) => {
    if (!userStore.isLoggedIn) {
      const route = useRoute();

      return navigateTo(`/auth?next=${route.fullPath}`);
    }

    e.target.disabled = true;
    e.target.classList.add('loading');

    switch (step.value) {
      case 0:
        ++step.value;
        await getAddresses();
        break;
      case 1:
        ++step.value;
        break;
      case 2:
        await placeOrder();
        break;
    }

    e.target.disabled = false;
    e.target.classList.remove('loading');
  };

  const getAddresses = async () => {
    try {
      const { data } = await userStore.getAddresses();
      addresses.value = data;
      deliveryAddressId.value = data[0]?._id;
    } catch (err) {
      console.error(err);
    }
  };

  const placeOrder = async () => {
    actionButtonRef.value.disabled = true;

    try {
      await orderStore.placeOrder({
        orderType: 'pickup',
        billingAddressId: deliveryAddressId.value,
        shippingAddressId: deliveryAddressId.value,
        payments: [
          {
            paymentMethodId: selectedPaymentMethod.value._id,
            amount: cartStore.cart.bill.total,
            status: 'pending',
          },
        ],
      });
      await router.replace('/account/orders');
      setTimeout(cartStore.destroy, 100);
    } catch (err) {
      console.error(err);
    } finally {
      if (actionButtonRef.value?.disabled) {
        actionButtonRef.value.disabled = false;
      }
    }
  };
</script>
