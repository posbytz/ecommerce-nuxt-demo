import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  id: 'user-store',
  state: () => ({
    user: null,
  }),
  actions: {
    validateAccount(data) {
      return $fetch('/api/v1/auth/account/validate', {
        method: 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        body: data,
      });
    },
    authorize(type, data) {
      return $fetch(`/api/v1/auth/${type}`, {
        method: 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        body: data,
      });
    },
    verifyOtp(otp) {
      return $fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: useRequestHeaders(['cookie', 'host']),
        body: { otp },
      });
    },
  },
  getters: {},
});
