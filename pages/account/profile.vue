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
      <div v-if="userStore.user" class="w-4/5 py-5 pl-5">
        <p class="text-xl mb-4">Profile</p>
        <Form
          ref="profileForm"
          as="div"
          :validation-schema="profileFormValidationSchema"
        >
          <div class="grid grid-cols-3 gap-3 mb-3">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Name</span>
              </label>
              <Field
                v-model="name"
                name="name"
                type="text"
                placeholder="Full Name"
                class="input input-bordered w-full"
              />
              <ErrorMessage name="name" class="text-xs text-error p-1" />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">DOB</span>
              </label>
              <Field
                v-model="dob"
                name="dob"
                type="text"
                placeholder="Date Of Birth (YYYY-MM-DD)"
                class="input input-bordered w-full"
              />
              <ErrorMessage name="dob" class="text-xs text-error p-1" />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Gender</span>
              </label>
              <div class="flex p-3">
                <label class="label cursor-pointer p-0 mr-3">
                  <Field v-model="gender" v-slot="{ field }" name="gender">
                    <input
                      v-bind="field"
                      type="radio"
                      value="male"
                      class="radio checked:bg-primary mr-2"
                      :checked="gender === 'male'"
                    />
                  </Field>
                  <span class="label-text">Male</span>
                </label>
                <label class="label cursor-pointer p-0">
                  <Field v-model="gender" v-slot="{ field }" name="gender">
                    <input
                      v-bind="field"
                      type="radio"
                      value="female"
                      class="radio checked:bg-primary mr-2"
                      :checked="gender === 'female'"
                    />
                  </Field>
                  <span class="label-text">Female</span>
                </label>
              </div>
              <ErrorMessage name="gender" class="text-xs text-error p-1" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-5">
            <div class="form-control">
              <label class="label justify-between">
                <span class="label-text">Email</span>
                <span class="link link-primary link-hover">Change</span>
              </label>
              <label class="input-group">
                <Field
                  v-model="email"
                  name="email"
                  type="text"
                  placeholder="Email"
                  class="input input-bordered w-full"
                />
                <span>
                  <CheckCircleIcon
                    v-if="userStore.user.email?.verified"
                    class="w-6 text-success"
                  />
                  <ExclamationCircleIcon v-else class="w-6 text-error" />
                </span>
              </label>
              <ErrorMessage name="email" class="text-xs text-error p-1" />
            </div>
            <div class="form-control">
              <label class="label justify-between">
                <span class="label-text">Mobile</span>
                <span class="link link-primary link-hover">Change</span>
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
                />
                <span>
                  <CheckCircleIcon
                    v-if="userStore.user.mobile.verified"
                    class="w-6 text-success"
                  />
                  <ExclamationCircleIcon v-else class="w-6 text-error" />
                </span>
              </label>
              <ErrorMessage name="mobile" class="text-xs text-error p-1" />
            </div>
          </div>
          <div class="form-control mb-5">
            <button class="btn btn-primary" @click="saveProfile">Save</button>
          </div>
          <div class="form-control">
            <label for="password-modal" class="btn btn-outline btn-primary">
              Change Password
            </label>
          </div>
        </Form>
      </div>
    </div>
  </div>
  <input input-sm type="checkbox" id="password-modal" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box max-w-2xl">
      <div class="flex justify-between">
        <h3 class="text-xl font-medium">Change Password</h3>
        <label
          ref="passwordModalCloseBtn"
          for="password-modal"
          class="btn btn-sm btn-ghost btn-circle text-error p-0"
          @click="passwordForm.resetForm"
        >
          <XMarkIcon class="w-6" />
        </label>
      </div>
      <div class="py-4">
        <Form
          ref="passwordForm"
          as="div"
          :validation-schema="passwordFormValidationSchema"
        >
          <div v-if="route.query.t !== 'cp'" class="form-control">
            <label class="label">
              <span class="label-text">Current Password *</span>
            </label>
            <label class="input-group">
              <Field
                v-model="currentPassword"
                v-slot="{ field }"
                name="currentPassword"
              >
                <input
                  v-bind="field"
                  type="password"
                  placeholder="Current Password *"
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
              name="currentPassword"
              class="text-xs text-error px-1 pt-1"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">New password *</span>
            </label>
            <label class="input-group">
              <Field
                v-model="newPassword"
                name="newPassword"
                type="password"
                placeholder="New password *"
                class="input input-bordered w-full"
              />
              <span>
                <label class="swap">
                  <input type="checkbox" @change="$togglePasswordVisibility" />
                  <EyeIcon class="swap-on w-6" />
                  <EyeSlashIcon class="swap-off w-6" />
                </label>
              </span>
            </label>
            <ErrorMessage name="newPassword" class="text-xs text-error p-1" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password Confirmation *</span>
            </label>
            <label class="input-group">
              <Field
                v-model="passwordConfirmation"
                v-slot="{ field }"
                name="passwordConfirmation"
              >
                <input
                  v-bind="field"
                  type="password"
                  placeholder="Password Confirmation *"
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
              name="passwordConfirmation"
              class="text-xs text-error px-1 pt-1"
            />
          </div>
        </Form>
      </div>
      <div class="modal-action mt-3">
        <button class="btn btn-primary" @click="changePassword">Change</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { Form, Field, ErrorMessage } from 'vee-validate';
  import * as yup from 'yup';
  import 'yup-phone';
  import { useUserStore } from '@/store/user';
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    EyeIcon,
    EyeSlashIcon,
  } from '@heroicons/vue/24/solid';

  definePageMeta({
    middleware: 'auth',
  });

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  if (process.client) {
    if (route.query.t === 'cp') {
      requestAnimationFrame(() => {
        document.querySelector('label[for="password-modal"]')?.click();
      });
    }
  }

  const profileForm = ref(null);
  const name = ref(userStore.user?.name);
  const dob = ref(userStore.user?.dob);
  const gender = ref(userStore.user?.gender);
  const email = ref(userStore.user?.email?.id);
  const mobile = ref({
    code: userStore.user?.mobile.code,
    number: userStore.user?.mobile.number,
  });
  const passwordModalCloseBtn = ref(null);
  const passwordForm = ref(null);
  const currentPassword = ref('');
  const newPassword = ref('');
  const passwordConfirmation = ref('');

  const profileFormValidationSchema = yup.object({
    name: yup.string(),
    dob: yup
      .string()
      .matches(/^\d{4}[\-](0?[1-9]|1[012])[\-](0?[1-9]|[12][0-9]|3[01])$/),
    email: yup.string().required().email(),
    mobile: yup.string().phone().required(),
  });
  const passwordFormValidationSchema = computed(() =>
    yup.object({
      currentPassword:
        route.query.t !== 'cp'
          ? yup.string().min(6).max(24).required()
          : undefined,
      newPassword: yup.string().min(6).max(24).required(),
      passwordConfirmation: yup
        .string()
        .min(6)
        .max(24)
        .required()
        .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
    })
  );

  const saveProfile = async () => {
    if ((await profileForm.value.validate()).valid) {
      userStore.updateProfile(
        {
          name: name.value,
          dob: dob.value,
          gender: gender.value,
        },
        profileForm.value
      );
    }
  };

  const changePassword = async () => {
    if ((await passwordForm.value.validate()).valid) {
      await userStore.changePassword(
        {
          currentPassword:
            route.query.t !== 'cp' ? currentPassword.value : undefined,
          newPassword: newPassword.value,
          passwordConfirmation: passwordConfirmation.value,
        },
        passwordForm.value
      );
      passwordModalCloseBtn.value?.click();

      if (route.query.t === 'cp') {
        const query = { ...route.query };

        delete query.t;
        await router.push({ query });
      }
    }
  };
</script>
