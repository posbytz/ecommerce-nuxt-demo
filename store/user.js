import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  id: 'user-store',
  state: () => ({
    user: null,
  }),
  actions: {
    async init() {
      const { req } = useRequestEvent();

      this.user = req.session.user || null;
    },
    validateAccount(data) {
      return $fetch('/api/v1/auth/account/validate', {
        method: 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        body: data,
      });
    },
    authorize(type, data, validator) {
      return $fetch(`/api/v1/auth/${type}`, {
        method: 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        params: { sessionStoreKey: 'user' },
        body: data,
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();

          nuxtApp?.$onResponseError(response, validator);
        },
      }).then((response) => {
        this.$patch({ user: response.data });
      });
    },
    verifyOtp(data, validator) {
      return $fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        params: { sessionStoreKey: 'user' },
        body: data,
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();

          nuxtApp?.$onResponseError(response, validator);
        },
      }).then((response) => {
        this.$patch({ user: response.data });
      });
    },
    forgotPassword(data, validator) {
      return $fetch('/api/v1/auth/password/forgot', {
        method: 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        params: { sessionStoreKey: 'user' },
        body: data,
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();

          nuxtApp?.$onResponseError(response, validator);
        },
      });
    },
    async logout(session) {
      await $fetch('/api/logout');
      if (session !== 'Expired') {
        window.location.reload();
      } else {
        window.location.href = '/auth'
      }
    },
    getAddresses() {
      return $fetch('/api/v1/user/addresses', {
        headers: useRequestHeaders(['cookie', 'host']),
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();

          nuxtApp?.$onResponseError(response);
        },
      });
    },
    saveAddress(data, validator) {
      return $fetch(`/api/v1/user/addresses${data._id ? `/${data._id}` : ''}`, {
        method: data._id ? 'PATCH' : 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        body: data,
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();

          nuxtApp?.$onResponseError(response, validator);
        },
      });
    },
    deleteAddress(id) {
      return $fetch(`/api/v1/user/addresses/${id}`, {
        method: 'DELETE',
        headers: useRequestHeaders(['cookie', 'host']),
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();

          nuxtApp?.$onResponseError(response);
        },
      });
    },
    updateProfile(data, validator) {
      return $fetch('/api/v1/user/profile', {
        method: 'PATCH',
        headers: useRequestHeaders(['cookie', 'host']),
        params: { sessionStoreKey: 'user' },
        body: data,
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();

          nuxtApp?.$onResponseError(response, validator);
        },
      });
    },
    changePassword(data, validator) {
      return $fetch('/api/v1/user/password/change', {
        method: 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        body: data,
        onResponseError: ({ response }) => {
          const nuxtApp = useNuxtApp();

          nuxtApp?.$onResponseError(response, validator);
        },
      });
    },
  },
  getters: {
    isLoggedIn: (state) => state.user?.hasOwnProperty('_id'),
  },
});
