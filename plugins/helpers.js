import { useUserStore } from '@/store/user';

export default defineNuxtPlugin(({ $pinia }) => {
  return {
    provide: {
      blurActiveElement: () => document.activeElement?.blur(),
      onResponseError: (response, validator) => {
        if (
          response.status === 401 &&
          response._data.data.message ===
          'authorization header missing or invalid'
        ) {
          const userStore = useUserStore($pinia);

          return userStore.logout();
        }

        if (response._data?.data?.errors && validator) {
          validator.setErrors(
            Object.keys(response._data.data.errors).reduce((errors, key) => {
              errors[key] = response._data.data.errors[key][0];

              return errors;
            }, {})
          );
        }
      },
      togglePasswordVisibility(e) {
        const input = e.target.closest('.input-group').querySelector('.input');

        input.type = input.type === 'password' ? 'text' : 'password';
      },
    },
  };
});
