<template>
  <div class="flex my-5">
    <h1 class="text-xl font-medium">RATINGS</h1>
    <StarIcon class="w-6"></StarIcon>
  </div>

  <div class="modal" :class="ImageModel.status ? 'modal-open' : null">
    <div class="modal-box w-6/12 max-w-5xl bg-gray-800 self-center flex">
      <div class="w-1/5 flex items-center">
        <ChevronLeftIcon
          class="w-10 h-10 text-white"
          :class="
            ImageModel.index == 0 ? 'cursor-not-allowed' : 'cursor-pointer'
          "
          @click="() => modalNext('PREV')"
        >
        </ChevronLeftIcon>
      </div>
      <div class="w-3/5 h-96 items-center">
        <img
          :src="ImageModel.image[ImageModel.index]"
          class="w-96 h-96 object-contain select-none"
        />
      </div>
      <div class="w-1/5 grid justify-items-end relative">
        <div class="flex items-center">
          <ChevronRightIcon
            class="w-10 h-10 text-white"
            :class="
              ImageModel.index == ImageModel.image.length - 1
                ? 'cursor-not-allowed'
                : 'cursor-pointer'
            "
            @click="() => modalNext('NEXT')"
          >
          </ChevronRightIcon>
        </div>
        <XMarkIcon
          class="w-10 h-10 text-white absolute cursor-pointer"
          @click="modalClose"
        ></XMarkIcon>
      </div>
    </div>
  </div>

  <div v-if="totalReview.rating" class="flex items-center">
    <div class="w-1/5">
      <div class="flex">
        <p class="text-5xl font-normal">{{ totalReview.rating }}</p>
        <StarIcon class="w-6 text-green-700"></StarIcon>
      </div>
      <div class="py-2">{{ totalReview.ratingCount }} reviews</div>
    </div>

    <div class="border-r h-36 mr-5"></div>

    <div class="w-3/5">
      <div class="mx-auto bg-white rounded-lg max-w-sm">
        <div class="mb-1 tracking-wide p-2">
          <div class="mx-2 px-2 pb-3">
            <!-- 5 star -->
            <div
              class="flex items-center mt-1"
              v-if="totalReview.ratingPercentage"
              v-for="key in Object.keys(totalReview.ratingPercentage).reverse()"
            >
              <div class="w-1/5 text-gray-700 tracking-tighter">
                <span>{{ key }} star</span>
              </div>
              <div class="w-3/5">
                <div class="bg-gray-300 w-full rounded-lg h-2">
                  <div
                    class="w-0 rounded-lg h-2"
                    :class="
                      key == 5 || key == 4
                        ? 'bg-green-600'
                        : key == 3
                        ? 'bg-green-600 opacity-50'
                        : key == 2
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    "
                    :style="{ width: `${totalReview.ratingPercentage[key]}%` }"
                  ></div>
                </div>
              </div>
              <div class="w-1/12 text-gray-500 pl-3">
                <span class="text-sm"
                  >{{ totalReview.ratingPercentage[key] }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="totalReview.rating == 0">No Rating Found</div>

  <div class="w-full flex justify-start items-start flex-col py-5 mt-2">
    <div class="flex justify-between w-11/12 items-center mb-5">
      <h1 class="text-2xl font-medium text-gray-800">Customer Reviews</h1>

      <div v-if="userStore.user">
        <button
          v-if="ownReview.length > 0"
          class="bg-gray-100 border border-gray-400 px-3 py-1 rounded text-gray-800 hover:bg-blue-600 hover:text-white"
          @click="updateReview"
        >
          <PencilSquareIcon class="w-4 inline" /> edit your review
        </button>

        <button
          v-else
          class="bg-gray-100 border border-gray-400 px-3 py-1 rounded text-gray-800 hover:bg-blue-600 hover:text-white"
          @click="writeReview"
        >
          <PencilSquareIcon class="w-4 inline" /> write a review
        </button>
      </div>
    </div>

    <div
      class="w-11/12 mb-8 py-3 pr-2"
      :class="writeReviewDisplay ? null : 'hidden'"
    >
      <div class="mb-8">
        <p class="py-3 text-gray-800 font-normal">Rate this product</p>

        <div class="flex justify-between">
          <div class="flex space-x-4">
            <div
              v-for="(star, index) in 5"
              @click="() => starsCalculation(index)"
            >
              <StarIcon
                v-if="starRating[index]"
                class="w-6 text-yellow-500"
              ></StarIcon>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </div>
          </div>
          <div
            v-if="!validation.isStars && !starRating[0]"
            class="text-red-500 px-5 text-sm"
          >
            Rating cannot be empty
          </div>
        </div>
      </div>

      <div class="mb-8">
        <label for="title" class="font-normal text-gray-900 block">Title</label>
        <input
          id="title"
          type="text"
          class="border-b border-gray-300 outline-none focus:border-blue-500 text-gray-900 block w-full p-3"
          :placeholder="
            validation.isTitle ? 'Review Title' : 'Title cannot be empty'
          "
          @change="setTitle"
          :value="title"
          :class="
            validation.isTitle
              ? null
              : 'placeholder:text-red-500 placeholder:text-end placeholder:text-sm'
          "
        />
      </div>
      <div class="mb-8">
        <label for="description" class="font-normal text-gray-900 pb-3 block"
          >Description</label
        >
        <textarea
          class="block w-full p-3 text-base text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-blue-500 focus:outline-none"
          rows="3"
          placeholder="description"
          @change="setDescription"
          :value="description"
        ></textarea>
      </div>

      <div
        class="flex justify-start items-start mb-6 space-x-5 bg-gray-50 h-36 w-full overflow-x-auto"
      >
        <div
          class="rounded border border-gray-100 bg-gray-200 hover:bg-gray-300 p-4 shadow-lg self-center ml-5"
        >
          <label
            for="upload"
            class="flex flex-col items-center gap-2 cursor-pointer"
          >
            <CameraIcon class="w-8 text-gray-700"></CameraIcon>
          </label>
          <input
            id="upload"
            type="file"
            class="hidden"
            @change="handleImageUpload"
            accept=".png, .jpg, .jpeg "
            multiple
          />
        </div>

        <div
          v-if="image.length > 0"
          v-for="(img, k) in image"
          class="self-center"
        >
          <div v-if="img.preview" class="relative">
            <img
              :src="img.preview"
              class="min-w-[96px] min-h-[96px] w-24 h-24 rounded-md object-contain"
              alt="review_screenshot"
            />
            <span
              class="w-7 h-7 rounded-full bg-gray-400 hover:bg-red-500 text-center font-bold absolute -right-2 -top-2 cursor-pointer"
              @click="() => deleteImage(k)"
              >x</span
            >
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="button"
          @click="postReview"
          class="inline-block bg-blue-500 text-white font-medium leading-tight rounded py-2 px-6 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out"
        >
          Submit
        </button>
      </div>
    </div>

    <div
      class="w-full my-3 bg-gray-100 p-5 rounded"
      v-if="productReviews.length > 0"
      v-for="(review, index) in productReviews"
    >
      <div class="flex flex-col md:flex-row justify-between w-full pr-2">
        <div class="flex flex-row justify-between items-start">
          <p
            class="text-xl font-normal leading-normal text-gray-800 dark:text-white"
          >
            {{ review.title }}
          </p>
        </div>
        <div
          class="flex px-2 py-1 rounded"
          :class="
            review.rating === 5 || review.rating === 4 || review.rating === 3
              ? 'bg-green-500'
              : 'bg-red-500'
          "
        >
          <div class="text-white font-normal">{{ review.rating }}</div>
          <StarIcon class="w-4 text-white" />
        </div>
      </div>
      <div id="menu" class="md:block">
        <p
          class="mt-3 text-sm leading-normal text-gray-600 dark:text-white w-full md:w-9/12 xl:w-5/6"
        >
          {{ review.description }}
        </p>

        <div
          v-if="review.image.length < 5"
          class="hidden md:flex mt-6 flex-row justify-start items-start space-x-4"
        >
          <div v-for="(img, iteration) in review.image.slice(0, 4)">
            <img
              :src="img"
              class="w-32 h-32 object-contain cursor-pointer"
              alt="review_screenshot"
              @click="() => openModel(review.image, iteration)"
            />
          </div>
        </div>
        <div
          v-else
          class="hidden md:flex mt-6 flex-row justify-start items-start space-x-5"
        >
          <div v-for="(img, iteration) in review.image.slice(0, 3)">
            <img
              :src="img"
              class="w-32 h-32 object-contain cursor-pointer"
              alt="review_screenshot"
              @click="() => openModel(review.image, iteration)"
            />
          </div>
          <div
            class="relative text-center cursor-pointer"
            @click="() => openModel(review.image, 3)"
          >
            <img
              :src="review.image[3]"
              class="w-32 h-32 brightness-50 object-contain"
              alt="review_screenshot"
            />
            <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white font-medium text-2xl"
            >
              +{{ review.image.length - 3 }}
            </div>
          </div>
        </div>

        <div
          class="mt-6 flex justify-between items-center flex-row space-x-2.5"
        >
          <div class="flex flex-col justify-start items-start space-y-2">
            <p
              class="text-base font-medium leading-none text-gray-800 dark:text-white"
            >
              {{ review.reviewer }}
            </p>
            <p class="text-sm leading-none text-gray-600 dark:text-white">
              {{ review.createdAt }}
            </p>
          </div>

          <div class="flex px-3 space-x-8">
            <div class="flex space-x-2">
              <div class="cursor-pointer">
                <HandThumbUpIcon
                  v-if="review.isLiked"
                  class="w-7 text-blue-500"
                  @click="
                    () => handleLikeReview(index, review.reviewId, 'LIKE')
                  "
                >
                </HandThumbUpIcon>
                <svg
                  v-else
                  @click="
                    () =>
                      userStore.user
                        ? handleLikeReview(index, review.reviewId, 'LIKE')
                        : null
                  "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-7 h-7"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                  />
                </svg>
              </div>
              <div class="select-none">{{ review.totalLikes }}</div>
            </div>

            <div class="flex space-x-2">
              <div class="cursor-pointer">
                <HandThumbDownIcon
                  v-if="review.isDisliked"
                  class="w-7 text-blue-500"
                  @click="
                    () => handleLikeReview(index, review.reviewId, 'DISLIKE')
                  "
                ></HandThumbDownIcon>
                <svg
                  v-else
                  @click="
                    () =>
                      userStore.user
                        ? handleLikeReview(index, review.reviewId, 'DISLIKE')
                        : null
                  "
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-7 h-7"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                  />
                </svg>
              </div>
              <div class="select-none">{{ review.totalDislikes }}</div>
            </div>

            <div
              v-if="
                ownReview.length > 0 && ownReview[0]._id === review.reviewId
              "
              class="dropdown dropdown-left"
            >
              <label tabindex="0">
                <EllipsisVerticalIcon
                  class="w-6 h-6 cursor-pointer"
                ></EllipsisVerticalIcon>
              </label>
              <ul
                tabindex="0"
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li @click="handleDeleteReview"><a>Delete</a></li>
              </ul>
            </div>
            <EllipsisVerticalIcon
              v-else
              class="w-6 h-6 cursor-not-allowed"
            ></EllipsisVerticalIcon>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalReview.rating == 0">No customer reviews</div>

    <div v-if="productReviews.length > 0" class="self-center">
      <div class="btn-group grid grid-cols-2">
        <button
          class="btn btn-outline btn-primary"
          @click="() => loadPagination('PREV')"
          :disabled="ButtonDisable.previous"
        >
          <ChevronLeftIcon class="w-4 h-4"></ChevronLeftIcon>Previous
        </button>
        <button
          class="btn btn-outline btn-primary"
          @click="() => loadPagination('NEXT')"
          :disabled="ButtonDisable.next"
        >
          Next<ChevronRightIcon class="w-4 h-4"></ChevronRightIcon>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { PencilSquareIcon } from '@heroicons/vue/24/outline';
  import {
    CameraIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisVerticalIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
    StarIcon,
    XMarkIcon,
  } from '@heroicons/vue/24/solid';
  import { useUserStore } from '@/store/user';

  const props = defineProps({
    itemId: {
      type: Number,
      required: true,
    },
  });

  const starRating = ref([false, false, false, false, false]);
  const individualRating = ref({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const writeReviewDisplay = ref(false);
  const title = ref('');
  const description = ref('');
  const totalReview = ref({});
  const ownReview = ref([]);
  const productReviews = ref([]);
  const image = ref([]);
  const { changeStarRating } = useStarRating();
  const ButtonDisable = ref({
    previous: true,
    next: false,
  });
  const pageCount = ref({});
  const ImageModel = ref({
    status: false,
    image: [],
  });
  const validation = ref({ isStars: true, isTitle: true });

  const userStore = useUserStore();

  //  Aws File Upload

  const convertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  let awsImageUpload = async (image, reviewId) => {
    let ImageLinks = [];
    let images =
      image
        .filter((e) => {
          if (e.data) {
            return (
              (e.data.type === 'image/jpg' ||
                e.data.type === 'image/png' ||
                e.data.type === 'image/jpeg') &&
              e.data.size <= 2000000
            );
          }
        })
        .map((f) => f.data) || [];

    if (images.length > 0 && reviewId) {
      await images.forEach(async (img) => {
        const convertedFile = await convertToBase64(img);

        let imageData = {
          image: convertedFile,
          imageName: img.name || '',
          imageType: img.type || '',
          reviewId: reviewId,
        };

        let postImage = await $fetch('/api/image', {
          method: 'POST',
          body: imageData,
          transform(response) {
            return response;
          },
        });
        ImageLinks.push(postImage);

        if (ImageLinks.length == images.length)
          handleUpdateReview(ImageLinks, reviewId);
      });
    } else {
      handleUpdateReview(ImageLinks, reviewId);
    }
  };

  const starsCalculation = (index) => {
    const updatedRating = starRating.value.map((e, i) =>
      i <= index ? true : false
    );
    starRating.value = updatedRating;
  };

  const calculateTotalRating = () => {
    let totalRating = 0;
    let totalUserRating = Object.values(individualRating.value).reduce(
      (acc, cv) => acc + cv,
      0
    );

    let ratingPercent = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (const key in individualRating.value) {
      ratingPercent[key] = (
        ((individualRating.value[key] * key) / (key * totalUserRating)) *
        100
      ).toFixed(1);
      totalRating += parseInt(key) * individualRating.value[key];
    }

    let starsCount =
      totalRating == 0 ? 0 : (totalRating / totalUserRating).toFixed(1);
    changeStarRating(starsCount);

    return {
      rating: starsCount,
      ratingCount: totalUserRating,
      ratingPercentage: ratingPercent,
    };
  };

  const writeReview = () => {
    writeReviewDisplay.value = true;
    title.value = '';
    description.value = '';
    image.value = [];
    starsCalculation(-1);
  };

  const updateImage = (img) => {
    let tempImage = img.map((e) => {
      return {
        preview: e,
        data: e,
      };
    });
    image.value = tempImage;
  };

  const deleteImage = async (index) => {
    let tempImage = [...image.value];
    tempImage.splice(index, 1);
    image.value = tempImage;
    if (ownReview.value.length > 0) ownReview.value[0].image.splice(index, 1);
  };

  const updateReview = () => {
    writeReviewDisplay.value = true;
    let temp = ownReview.value[0];
    title.value = temp.title;
    description.value = temp.description;
    starsCalculation(temp.rating - 1);
    updateImage(temp.image);
  };

  const dateCalculation = (date) => {
    let dateFormat = new Date(date);
    let dateResult = dateFormat.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return dateResult;
  };

  const handleImageUpload = (e) => {
    e.preventDefault();

    let img = [];

    for (let i = 0; i < e.target.files.length; i++) {
      let fileType = e.target.files[i].type;
      let fileSize = e.target.files[i].size;
      let singleImage = {
        preview: URL.createObjectURL(e.target.files[i]),
        data: e.target.files[i],
      };
      if (
        (fileType === 'image/jpg' ||
          fileType === 'image/png' ||
          fileType === 'image/jpeg') &&
        fileSize <= 2000000
      ) {
        img.push(singleImage);
      }
    }
    image.value = [...image.value, ...img];
  };

  let setTitle = (e) => (title.value = e.target.value);
  let setDescription = (e) => (description.value = e.target.value);

  let calculateRating = (stars) => {
    let count = stars ? stars.filter((e) => e === true).length : 0;
    return count;
  };

  let openModel = (img, index) => {
    ImageModel.value = {
      status: true,
      image: img,
      index: index,
    };
  };

  let modalClose = () => {
    ImageModel.value.status = false;
  };

  let modalNext = (button) => {
    let temp = ImageModel.value;

    if (button === 'NEXT' && temp.index < temp.image.length - 1) {
      temp.index = temp.index + 1;
      ImageModel.value = temp;
    }
    if (button === 'PREV' && temp.index !== 0) {
      temp.index = temp.index - 1;
      ImageModel.value = temp;
    }
  };

  let loadPagination = (page) => {
    let currentPage = pageCount.value.currentPage;
    let lastPage = pageCount.value.lastPage;

    if (page == 'NEXT' && currentPage >= 1 && currentPage < lastPage) {
      pageCount.value.currentPage = currentPage + 1;
      ButtonDisable.value.previous = false;
      handleGetReview();
    }
    if (page == 'PREV' && currentPage > 1) {
      pageCount.value.currentPage = currentPage - 1;
      handleGetReview();
      ButtonDisable.value.next = false;
    }
  };

  let reviewValidation = () => {
    let rating = calculateRating(starRating.value);
    let titles = title.value;

    if (!rating) validation.value.isStars = false;
    else validation.value.isStars = true;

    if (!titles) validation.value.isTitle = false;
    else validation.value.isTitle = true;
  };

  // Api Requests

  const handleGetReview = () => {
    const { data: getReviews } = useAsyncData('getReviews', async () => {
      let response;
      try {
        response = await $fetch('/api/v1/reviews', {
          method: 'GET',
          headers: useRequestHeaders(['cookie']),
          query: {
            itemId: props.itemId,
            page: pageCount.value.currentPage,
            limit: 20,
          },
          transform(res) {
            return res.data.results;
          },
        });

        let resultReview = response.data.results;
        const userReview = JSON.parse(JSON.stringify(response.data.userReview));
        let page = response.data.pagination;

        if (userReview.length > 0) {
          resultReview = resultReview.filter((g) => g._id != userReview[0]._id);
          if (userReview.length > 0 && page.currentPage == 1)
            resultReview.unshift(...userReview);
        }

        resultReview = resultReview.map((e) => {
          return {
            reviewId: e._id,
            itemId: e.itemId,
            rating: e.rating,
            title: e.title,
            description: e.description,
            image: e.image,
            reviewer: e.reviewer,
            createdAt: dateCalculation(e.createdAt),
            totalLikes: e.totalLikes,
            totalDislikes: e.totalDislikes,
            isLiked: e.isLiked,
            isDisliked: e.isDisliked,
          };
        });

        individualRating.value = response.data.totalRating;
        ownReview.value = response.data.userReview;
        productReviews.value = resultReview;
        totalReview.value = calculateTotalRating();
        pageCount.value = response.data.pagination;

        if (pageCount.value.currentPage == pageCount.value.lastPage)
          ButtonDisable.value.next = true;
        if (pageCount.value.currentPage == 1)
          ButtonDisable.value.previous = true;
      } catch (error) {
        console.log(error);
      }
    });
  };
  handleGetReview();

  const handlePostReview = async () => {
    let ratingData = {
      itemId: props.itemId,
      rating: calculateRating(starRating.value),
      title: title.value || '',
      description: description.value || '',
      image: [],
    };

    const { data: reviewResult } = await $fetch('/api/v1/reviews', {
      method: 'POST',
      headers: useRequestHeaders(['cookie']),
      body: ratingData,
      transform(response) {
        return response.data;
      },
    });
    if (reviewResult && image.value.length > 0) {
      await awsImageUpload(image.value, reviewResult._id);
    }
    if (reviewResult && image.value.length == 0) handleGetReview();
  };

  const handleUpdateReview = async (awsImages, reviewId) => {
    let param = ownReview.value.length > 0 ? ownReview.value[0]._id : reviewId;
    let oldImages = ownReview.value.length > 0 ? ownReview.value[0].image : [];
    let imageData = awsImages ? [...oldImages, ...awsImages] : [...oldImages];

    let ratingData = {
      itemId: props.itemId,
      rating: calculateRating(starRating.value),
      title: title.value || '',
      description: description.value || '',
      image: imageData,
    };

    const { data: updatedReview } = await $fetch(`/api/v1/reviews/${param}`, {
      method: 'PATCH',
      headers: useRequestHeaders(['cookie']),
      body: ratingData,
      transform(response) {
        return response.data;
      },
    });
    handleGetReview();
    validation.value.isStars = true;
    validation.value.isTitle = true;
  };

  const postReview = async () => {
    reviewValidation();
    if (validation.value.isStars && validation.value.isTitle) {
      if (ownReview.value.length > 0) {
        if (image.value.length > 0)
          await awsImageUpload(image.value, ownReview.value[0]._id);
        else handleUpdateReview();
      } else {
        handlePostReview();
      }
      writeReviewDisplay.value = false;
    } else {
      writeReviewDisplay.value = true;
    }
  };

  const handleDeleteReview = async () => {
    let param = ownReview.value[0]._id;
    writeReviewDisplay.value = false;

    try {
      const { data: deletedReview } = await $fetch(`/api/v1/reviews/${param}`, {
        method: 'DELETE',
        headers: useRequestHeaders(['cookie']),
      });
      handleGetReview();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikeReview = async (index, reviewId, task) => {
    let temp = productReviews.value[index];
    let reviewData;

    if (task === 'LIKE') {
      if (temp.isLiked) reviewData = { isLiked: false };
      else reviewData = { isLiked: true };
    }
    if (task === 'DISLIKE') {
      if (temp.isDisliked) reviewData = { isDisliked: false };
      else reviewData = { isDisliked: true };
    }

    try {
      const { data: likePreview } = await $fetch(
        `/api/v1/reviews/${reviewId}`,
        {
          method: 'PATCH',
          headers: useRequestHeaders(['cookie']),
          body: reviewData,
          transform(response) {
            return response.data;
          },
        }
      );

      temp.totalLikes = likePreview.totalLikes;
      temp.totalDislikes = likePreview.totalDislikes;
      temp.isLiked = likePreview.isLiked;
      temp.isDisliked = likePreview.isDisliked;
      productReviews.value[index] = temp;
    } catch (error) {
      console.log(error);
    }
  };
</script>
