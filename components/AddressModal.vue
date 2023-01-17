<template>
  <input input-sm type="checkbox" id="address-modal" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box max-w-2xl">
      <div class="flex justify-between">
        <h3 class="text-xl font-medium">
          {{ props.address ? 'Edit' : 'Add New' }} Address
        </h3>
        <label
          ref="closeBtn"
          for="address-modal"
          class="btn btn-sm btn-ghost btn-circle text-error p-0"
          @click="closeModal"
        >
          <XMarkIcon class="w-6" />
        </label>
      </div>
      <div class="py-4">
        <Form ref="addressForm" as="div" :validation-schema="validationSchema">
          <h3 class="text-lg font-medium">Contact Details</h3>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Name *</span>
              </label>
              <Field v-model="name" v-slot="{ field }" name="name" >
                <input
                  v-bind="field"
                  type="text"
                  placeholder="Name *"
                  class="input input-sm input-bordered"
                />
              </Field>
              <ErrorMessage name="name" class="text-xs text-error px-1 pt-1" />
            </div>
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
                  class="input input-sm input-bordered w-full"
                  autofocus
                  validate-on-input
                />
              </label>
              <ErrorMessage name="mobile" class="text-xs text-error p-1" />
            </div>
          </div>
          <h3 class="text-lg font-medium">Address</h3>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Address Line *</span>
            </label>
            <Field v-model="line" v-slot="{ field }" name="line">
              <input
                v-bind="field"
                type="text"
                placeholder="Door No, Floor, Building, Street"
                class="input input-sm input-bordered"
              />
            </Field>
            <ErrorMessage name="line" class="text-xs text-error px-1 pt-1" />
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Area *</span>
              </label>
              <Field v-model="area" v-slot="{ field }" name="area">
                <input
                  v-bind="field"
                  type="text"
                  placeholder="Area *"
                  class="input input-sm input-bordered"
                />
              </Field>
              <ErrorMessage name="area" class="text-xs text-error px-1 pt-1" />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">City *</span>
              </label>
              <Field v-model="city" v-slot="{ field }" name="city">
                <input
                  v-bind="field"
                  type="text"
                  placeholder="City *"
                  class="input input-sm input-bordered"
                />
              </Field>
              <ErrorMessage name="city" class="text-xs text-error px-1 pt-1" />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">State *</span>
              </label>
              <Field v-model="state" v-slot="{ field }" name="state">
                <input
                  v-bind="field"
                  type="text"
                  placeholder="State *"
                  class="input input-sm input-bordered"
                />
              </Field>
              <ErrorMessage name="state" class="text-xs text-error px-1 pt-1" />
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Country *</span>
              </label>
              <Field v-model="country" v-slot="{ field }" name="country">
                <input
                  v-bind="field"
                  type="text"
                  placeholder="Country *"
                  class="input input-sm input-bordered"
                />
              </Field>
              <ErrorMessage
                name="country"
                class="text-xs text-error px-1 pt-1"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Zip *</span>
              </label>
              <Field v-model="zip" v-slot="{ field }" name="zip">
                <input
                  v-bind="field"
                  type="text"
                  placeholder="Zip *"
                  class="input input-sm input-bordered"
                />
              </Field>
              <ErrorMessage name="zip" class="text-xs text-error px-1 pt-1" />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text">Landmark</span>
              </label>
              <Field v-model="landmark" v-slot="{ field }" name="landmark">
                <input
                  v-bind="field"
                  type="text"
                  placeholder="Landmark"
                  class="input input-sm input-bordered"
                />
              </Field>
              <ErrorMessage
                name="landmark"
                class="text-xs text-error px-1 pt-1"
              />
            </div>
          </div>
          <label class="label">
            <span class="label-text">Save Address As *</span>
          </label>
          <div class="flex">
            <div class="form-control mr-3">
              <label class="label cursor-pointer p-0">
                <Field
                  v-model="annotation"
                  v-slot="{ field }"
                  name="annotation"
                >
                  <input
                    v-bind="field"
                    type="radio"
                    value="home"
                    class="radio checked:bg-primary mr-2"
                    :checked="annotation === 'home'"
                  />
                </Field>
                <span class="label-text">Home</span>
              </label>
            </div>
            <div class="form-control">
              <label class="label cursor-pointer p-0">
                <Field
                  v-model="annotation"
                  v-slot="{ field }"
                  name="annotation"
                >
                  <input
                    v-bind="field"
                    type="radio"
                    value="work"
                    class="radio checked:bg-primary mr-2"
                    :checked="annotation === 'work'"
                  />
                </Field>
                <span class="label-text">Work</span>
              </label>
            </div>
          </div>
          <ErrorMessage
            name="annotation"
            class="text-xs text-error px-1 pt-1"
          />
        </Form>
      </div>
      <div class="modal-action mt-3">
        <button class="btn btn-primary" @click="saveAddress">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { XMarkIcon } from '@heroicons/vue/24/outline';
  import { Form, Field, ErrorMessage } from 'vee-validate';
  import * as yup from 'yup';
  import 'yup-phone';
  import { useUserStore } from '@/store/user';

  const props = defineProps({
    address: {
      type: Object,
      default: null,
    },
  });
  const emit = defineEmits(['address', 'close']);

  const userStore = useUserStore();

  const closeBtn = ref(null);
  const addressForm = ref(null);
  const name = ref(props.address?.contact.name);
  const mobile = ref({
    code: props.address?.contact.mobile.code || '+91',
    number: props.address?.contact.mobile.number,
  });
  const line = ref(props.address?.line);
  const area = ref(props.address?.area);
  const city = ref(props.address?.city);
  const state = ref(props.address?.state);
  const country = ref(props.address?.country);
  const zip = ref(props.address?.zip);
  const landmark = ref(props.address?.landmark);
  const annotation = ref(props.address?.annotation);

  const validationSchema = yup.object({
    name: yup.string().required(),
    mobile: yup.string().phone().required(),
    line: yup.string().required(),
    area: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    country: yup.string().required(),
    zip: yup.number().required(),
    landmark: yup.string().notRequired(),
  });

  const saveAddress = async () => {
    if ((await addressForm.value.validate()).valid) {
      try {
        const address = await userStore.saveAddress(
          {
            _id: props.address?._id,
            contact: {
              name: name.value,
              mobile: mobile.value,
            },
            line: line.value,
            area: area.value,
            city: city.value,
            state: state.value,
            country: country.value,
            zip: zip.value,
            landmark: landmark.value,
            annotation: annotation.value,
          },
          addressForm.value
        );

        emit('address', address.data);
        closeBtn.value.click();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const closeModal = () => {
    addressForm.value.resetForm();
    emit('close');
  };
</script>
