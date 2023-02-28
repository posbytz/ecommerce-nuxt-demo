<template>
  <div class="px-5 pt-5">
    <h1 class="text-2xl mb-4">Your Account</h1>
    <div class="flex border-t">
      <div
        class="max-lg:hidden w-1/5 sticky top-16 overflow-auto border-r py-3"
        style="max-height: calc(100vh - 64px)"
      >
        <AccountMenu />
      </div>
      <div v-if="orders" class="w-full lg:w-4/5 py-5 lg:pl-5">
        <p class="text-xl mb-4">Orders</p>
        <div
          v-for="(order, i) in orders.results"
          class="card rounded border bg-base-100 drop-shadow"
          :class="{
            'mb-4': i < orders?.results.length - 1,
          }"
        >
          <div class="card-body capitalize p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="max-md:flex-col">
                <p>
                  Order ID # <span class="max-md:text-xs">{{ order._id }}</span>
                </p>
                <p class="text-sm text-slate-500">
                  {{
                    new Date(order.createdAt).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  }}
                </p>
              </div>
              <div
                class="badge border-0 text-white max-md:mb-12 max-md:text-xs"
                :class="
                  order.status === 'complete' ? 'bg-green-600' : 'bg-orange-400'
                "
              >
                {{ order.status === 'complete' ? 'completed' : 'processing' }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <button
                type="button"
                @click="() => openOrderModal(order)"
                class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                View Details
              </button>
              <button
                v-if="order.status == 'complete'"
                type="button"
                @click="() => handleReorder(order._id, {})"
                class="inline-block px-6 py-2.5 mx-2 bg-green-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                Reorder
              </button>
              <p class="font-semibold text-xl text-right">
                Total: {{ $n(order.bill.total, 'currency', 'en-US') }}
              </p>
            </div>
          </div>
        </div>
        <div class="modal" :class="reorderModalOpen ? 'modal-open' : null">
          <div class="modal-box">
            <div class="flex justify-between">
              <h3 class="font-medium text-lg">Already items exist in cart !</h3>
              <label
                for="reorder-modal"
                class="btn btn-sm btn-ghost btn-circle text-error p-0"
                @click="modalClose"
              >
                <XMarkIcon class="w-6" />
              </label>
            </div>
            <p class="py-4">
              Do you want to clear the cart and reorder the items?
            </p>
            <div class="modal-action mt-0">
              <a
                href="#"
                class="btn btn-outline btn-success"
                @click="() => handleReorder(reorderId, { force: true })"
                >Confirm</a
              >
              <a href="#" class="btn btn-outline btn-error" @click="modalClose"
                >cancel</a
              >
            </div>
          </div>
        </div>
        <div
          ref="modalElement"
          class="modal"
          :class="isOrderModal ? 'modal-open' : null"
        >
          <div
            class="modal-box w-11/12 lg:w-6/12 max-w-5xl h-4/5 relative max-md:p-4"
          >
            <label
              class="btn btn-sm btn-circle absolute right-2 top-2"
              @click="closeOrderModal"
              >✕</label
            >
            <h3 class="font-medium text-lg">
              Hi {{ orderDetails?.user.name }},
            </h3>
            <div class="pt-2">
              {{
                orderDetails?.status == 'complete'
                  ? 'Your order has been successfully completed.'
                  : 'Your order has been placed successfully and being processed.'
              }}
            </div>
            <div class="divider divider-horizonal"></div>

            <div class="flex flex-col lg:flex-row max-lg:mb-2 justify-between">
              <div class="">
                <div class="text-gray-400 font-medium lg:text-lg">Order #</div>
                <div class="font-medium text-lg">{{ orderDetails?._id }}</div>
              </div>
              <div class="">
                <div class="text-gray-400 font-medium text-lg">Order Date</div>
                <div class="font-medium text-lg">
                  {{
                    new Date(orderDetails?.createdAt).toLocaleDateString(
                      'en-IN',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )
                  }}
                </div>
              </div>
            </div>
            <div class="divider divider-horizonal"></div>
            <div>
              <div class="text-gray-400 font-medium text-lg">
                Delivery Address:
              </div>
              <div class="w-full lg:w-5/6">
                {{
                  [
                    orderDetails?.shippingAddress.line,
                    orderDetails?.shippingAddress.area,
                    orderDetails?.shippingAddress.city,
                    orderDetails?.shippingAddress.state,
                    orderDetails?.shippingAddress.country,
                    orderDetails?.shippingAddress.zip,
                  ].join(', ')
                }}
              </div>
            </div>
            <div class="divider divider-horizonal"></div>
            <div class="flex max-lg:w-full">
              <div class="w-7/12 lg:w-8/12">
                <div class="text-gray-400 font-medium text-lg pb-2">
                  Product Info
                </div>
              </div>
              <div class="w-6/12 lg:w-4/12 flex justify-between">
                <div class="text-gray-400 font-medium text-lg pb-2">
                  Quantity
                </div>
                <div class="text-gray-400 font-medium text-lg pb-2 px-5">
                  Price
                </div>
              </div>
            </div>
            <div v-for="item in orderDetails?.items" class="flex max-lg:w-full">
              <div class="w-6/12 lg:w-8/12">
                <div>{{ item.name }}</div>
              </div>
              <div class="flex justify-between w-6/12 lg:w-4/12 max-lg:pl-5">
                <div>{{ item.quantity }}</div>

                <div class="px-2">
                  {{ $n(item.price || 0, 'currency', 'en-US') }}
                </div>
              </div>
            </div>
            <div class="divider divider-horizonal"></div>
            <div class="flex justify-between">
              <div>Subtotal</div>
              <div class="px-2">
                {{ $n(orderDetails?.bill.subtotal || 0, 'currency', 'en-US') }}
              </div>
            </div>
            <div v-if="orderDetails?.bill.tax" class="flex justify-between">
              <div>Tax</div>
              <div class="px-2">
                {{ $n(orderDetails?.bill.tax || 0, 'currency', 'en-US') }}
              </div>
            </div>
            <div
              v-if="orderDetails?.bill.discount"
              class="flex justify-between"
            >
              <div>Discount</div>
              <div class="px-2">
                {{ $n(orderDetails?.bill.discount || 0, 'currency', 'en-US') }}
              </div>
            </div>
            <div v-if="orderDetails?.bill.charge" class="flex justify-between">
              <div>Charges</div>
              <div class="px-2">
                {{ $n(orderDetails?.bill.charge || 0, 'currency', 'en-US') }}
              </div>
            </div>
            <div
              v-if="orderDetails?.bill.roundOff"
              class="flex justify-between"
            >
              <div>Round Off</div>
              <div class="px-2">
                {{ $n(orderDetails?.bill.roundOff || 0, 'currency', 'en-US') }}
              </div>
            </div>
            <div class="divider divider-horizonal"></div>
            <div class="flex justify-between">
              <div>
                <div class="text-xl font-medium">Total</div>
                <div>
                  {{ orderDetails?.status == 'complete' ? 'paid' : 'payable' }}
                  via {{ orderDetails?.payments[0].slug }}
                </div>
              </div>
              <div class="text-xl font-medium px-2">
                {{ $n(orderDetails?.bill.total || 0, 'currency', 'en-US') }}
              </div>
            </div>
            <div class="divider divider-horizonal"></div>
          </div>
        </div>
        <div class="text-right">
          <Pagination :options="orders.pagination" @change="refreshOrders" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import { useCartStore } from '~~/store/cart';
  definePageMeta({
    middleware: 'auth',
  });

  const route = useRoute();
  const reorderModalOpen = ref(false);
  const reorderId = ref('');
  const cartStore = useCartStore();
  const router = useRouter();
  const orderDetails = ref(null);
  const isOrderModal = ref(false);
  const modalElement = ref(null);

  const { data: orders, refresh: refreshOrders } = await useFetch(
    '/api/v1/orders',
    {
      headers: useRequestHeaders(['cookie', 'host']),
      onRequest({ request, options }) {
        options.params = { ...route.query };
      },
      transform(response) {
        return response.data;
      },
      onResponseError: ({ response }) => {
        const nuxtApp = useNuxtApp();
        nuxtApp?.$onResponseError(response);
      },
    }
  );
  let handleReorder = (orderId, orderQuery) => {
    reorderId.value = orderId;

    useAsyncData('reorder', async () => {
      try {
        await cartStore.reorder(orderId, orderQuery);
        reorderModalOpen.value = false;
        router.push('/checkout');
      } catch (error) {
        if (error?.status === 403) {
          reorderModalOpen.value = true;
        }
      }
    });
  };

  let modalClose = () => {
    reorderModalOpen.value = false;
  };

  let openOrderModal = (order) => {
    orderDetails.value = order;
    isOrderModal.value = true;
  };

  let closeOrderModal = () => {
    isOrderModal.value = false;
  };
</script>
