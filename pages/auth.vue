<template>
  <div class="flex min-h-[calc(100vh-64px)]">
    <div class="m-auto">
      <div class="card w-96 border m-6 shadow-2xl">
        <Form
          v-if="!showOtpVerification"
          ref="authForm"
          as="div"
          class="card-body"
          :validation-schema="validationSchema"
        >
          <h3 class="text-xl font-medium">Login or Signup</h3>
          <!-- <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              type="text"
              placeholder="Email"
              class="input input-bordered"
            />
          </div> -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Mobile</span>
            </label>
            <label class="input-group">
              <span>
                {{ mobile.code }}
              </span>
              <Field
                v-model="mobile.number"
                name="mobile"
                type="text"
                placeholder="Mobile"
                class="input input-bordered w-full"
                autofocus
              />
            </label>
            <ErrorMessage name="mobile" class="text-xs text-error p-1" />
          </div>
          <div v-if="showPassword" class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <label class="input-group">
              <Field v-model="password" v-slot="{ field }" name="password">
                <input
                  v-bind="field"
                  ref="passwordInputRef"
                  type="password"
                  :placeholder="
                    accountExists ? 'Enter your password' : 'Set a password'
                  "
                  class="input input-bordered w-full"
                />
              </Field>
              <span>
                <label class="swap">
                  <input type="checkbox" @change="$togglePasswordVisibility" />
                  <EyeIcon class="swap-on w-6" />
                  <EyeSlashIcon class="swap-off w-6" />
                </label>
              </span>
            </label>
            <ErrorMessage
              name="password"
              class="text-xs text-error px-1 pt-1"
            />
            <label v-if="accountExists" class="label pb-0">
              <span
                class="label-text-alt link link-primary link-hover"
                @click="forgotPassword"
              >
                Forgot password?
              </span>
            </label>
            <div class="form-control mt-6">
              <button class="btn btn-primary" @click="authorize">
                {{ accountExists ? 'Login' : 'Signup' }}
              </button>
            </div>
          </div>
          <template v-else>
            <p class="text-sm my-3">
              By continuing, I agree to the
              <NuxtLink to="/terms-of-use" class="link link-primary link-hover"
                >Terms of Use</NuxtLink
              >
              &
              <NuxtLink
                to="/privacy-policy"
                class="link link-primary link-hover"
                >Privacy Policy</NuxtLink
              >
            </p>
            <div class="form-control">
              <button class="btn btn-primary" @click="validateAccount">
                Continue
              </button>
            </div>
          </template>
        </Form>
        <Form v-else ref="otpForm" as="div" class="card-body">
          <div>
            <h3 class="text-xl font-medium">Verify with OTP</h3>
            <p class="text-sm text-slate-400">Sent to {{ mobile.number }}</p>
          </div>
          <div class="py-10">
            <div class="flex">
              <input
                v-for="i in [...Array(6).keys()]"
                :key="i"
                type="text"
                maxlength="1"
                class="otp input input-bordered w-11"
                :class="{
                  'mr-2': i < 5,
                }"
                @keyup="onOtpKeyup(i)"
              />
            </div>
            <Field as="div" name="otp" />
            <ErrorMessage name="otp" class="text-xs text-error px-1 pt-1" />
            <label class="label">
              <a href="#" class="label-text-alt link link-primary link-hover"
                >Resend OTP</a
              >
            </label>
          </div>
          <p class="text-sm">
            Having trouble logging in?
            <a href="#" class="link link-primary link-hover">Get help</a>
          </p>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Form, Field, ErrorMessage } from 'vee-validate';
  import * as yup from 'yup';
  import 'yup-phone';
  import { useUserStore } from '@/store/user';
  import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid';

  definePageMeta({
    middleware: 'auth',
  });

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  const authForm = ref(null);
  const otpForm = ref(null);
  const mobile = ref({
    code: '+91',
    number: null,
  });
  const accountExists = ref(false);
  const showPassword = ref(false);
  const passwordInputRef = ref(null);
  const password = ref('');
  const showOtpVerification = ref(false);

  const validationSchema = computed(() =>
    yup.object({
      // email: yup.string().required().email(),
      mobile: yup.string().phone().required(),
      password: showPassword.value
        ? yup.string().required().min(6).max(24)
        : undefined,
    })
  );

  const validateAccount = async () => {
    if ((await authForm.value.validate()).valid) {
      try {
        await userStore.validateAccount({ mobile: mobile.value });
        accountExists.value = true;
      } catch (err) {
        accountExists.value = false;
      } finally {
        showPassword.value = true;
        requestAnimationFrame(() => passwordInputRef.value?.focus());
      }
    }
  };

  const authorize = async () => {
    if ((await authForm.value.validate()).valid) {
      try {
        await userStore.authorize(
          accountExists.value ? 'signin' : 'signup',
          {
            mobile: mobile.value,
            password: password.value,
          },
          authForm.value
        );

        if (accountExists.value) {
          navigateTo(route.query.next || '/', { replace: true });
        } else {
          showOtpForm();
        }
      } catch (err) {
        if (accountExists.value && err.response.status === 403) {
          showOtpForm();
        }
      }
    }
  };

  const showOtpForm = () => {
    showOtpVerification.value = true;
    requestAnimationFrame(() => {
      document.querySelector('.otp').focus();
    });
  };

  const onOtpKeyup = (i) => {
    otpForm.value.resetForm();

    const allInputs = document.querySelectorAll('.otp');
    const nextInput = allInputs[i + 1];
    const previousInput = allInputs[i - 1];

    if (allInputs[i].value) {
      const otp = [...allInputs].reduce((otp, input) => {
        if (input.value) {
          otp += input.value;
        }

        return otp;
      }, '');

      if (otp.length === 6) {
        allInputs[i].blur();
        userStore
          .verifyOtp({ otp: +otp, source: 'mobile' }, otpForm.value)
          .then(() => navigateTo(route.query.next || '/', { replace: true }))
          .catch(() => {
            allInputs.forEach((i) => (i.value = ''));
            allInputs[0].focus();
          });
      } else if (nextInput) {
        nextInput.focus();
      }
    } else if (previousInput) {
      previousInput.value = '';
      previousInput.focus();
    }
  };

  const forgotPassword = async () => {
    if ((await authForm.value.validateField('mobile')).valid) {
      await userStore.forgotPassword({ mobile: mobile.value });
      await router.push({ query: { next: '/account/profile?t=cp' } });
      showOtpForm();
    }
  };
</script>
