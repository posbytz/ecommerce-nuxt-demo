<template>
  <div class="px-5 pt-5">
    <h1 class="text-2xl mb-4">Your Account</h1>
    <div class="flex border-t">
      <div
        class="w-1/5 sticky top-16 overflow-auto border-r py-3"
        style="max-height: calc(100vh - 64px)"
      >
        <AccountMenu />
      </div>
      <div v-if="orders" class="w-4/5 py-5 pl-5">
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
              <div>
                <p>Order ID # {{ order._id }}</p>
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
              <div class="badge badge-primary badge-outline">
                {{ order.status }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <a href="#" class="link link-primary link-hover">View Details</a>
              <p class="font-semibold text-xl text-right">
                Total: {{ $n(order.bill.total, 'currency', 'en-US') }}
              </p>
            </div>
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
  definePageMeta({
    middleware: 'auth',
  });

  const route = useRoute();

  const { data: orders, refresh: refreshOrders } = await useFetch(
    '/api/v1/orders',
    {
      headers: useRequestHeaders(['cookie']),
      onRequest({ request, options }) {
        options.params = { ...route.query };
      },
      transform(response) {
        return response.data;
      },
    }
  );
</script>
