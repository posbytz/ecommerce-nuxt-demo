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
      <div class="w-4/5 py-5 pl-5">
        <div class="flex items-center justify-between mb-4">
          <p class="text-xl">Addresses</p>
          <label for="address-modal" class="btn btn-sm btn-outline btn-primary">
            Add New Address
          </label>
        </div>
        <div
          v-for="(address, i) in addresses"
          class="card rounded border bg-base-100 drop-shadow"
          :class="{
            'mb-4': i < addresses.length - 1,
          }"
        >
          <div class="card-body capitalize p-4">
            <div class="flex items-center font-medium mb-2">
              <p>
                {{ address.contact.name }}
                <span class="badge badge-sm badge-primary badge-outline ml-2">{{
                  address.annotation
                }}</span>
              </p>
              <div class="grid grid-cols-2 gap-3">
                <label
                  for="address-modal"
                  class="btn btn-sm btn-outline btn-primary"
                  @click="editAddress(address)"
                >
                  Edit
                </label>
                <button
                  class="btn btn-sm btn-outline btn-error"
                  @click="deleteAddress(address._id)"
                >
                  Delete
                </button>
              </div>
            </div>
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
            <p class="mt-3">Contact: {{ address.contact.mobile.number }}</p>
          </div>
        </div>
      </div>
    </div>
    <AddressModal
      :key="addressToEdit?._id"
      :address="addressToEdit"
      @address="onAddress"
      @close="addressToEdit = null"
    />
  </div>
</template>

<script setup>
  import { useUserStore } from '@/store/user';

  definePageMeta({
    middleware: 'auth',
  });

  const userStore = useUserStore();
  const addresses = ref((await userStore.getAddresses()).data);
  const addressToEdit = ref(null);

  const onAddress = (address) => {
    const addressIndex = addresses.value.findIndex(
      (a) => a._id === address._id
    );

    if (addressIndex > -1) {
      addresses.value[addressIndex] = address;
    } else {
      addresses.value.push(address);
    }
  };

  const editAddress = (address) => {
    addressToEdit.value = address;
  };

  const deleteAddress = async (id) => {
    await userStore.deleteAddress(id);
    addresses.value.splice(
      addresses.value.findIndex((a) => a._id === id),
      1
    );
  };
</script>
