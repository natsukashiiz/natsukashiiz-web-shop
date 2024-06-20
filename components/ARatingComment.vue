<script setup lang="ts">
defineProps({
  account: {
    type: Object as PropType<{
      name: string;
    }>,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});
</script>
<template>
  <article>
    <div class="flex items-center mb-4">
      <UAvatar
        :alt="account.name.toUpperCase()"
        size="md"
        class="border-2 border-primary-500 hover:border-primary-400 cursor-pointer mr-4"
      />
      <div class="font-medium dark:text-white">
        <p>
          {{ account.name }}
        </p>
        <div class="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
          <template v-for="i in 5" :key="i">
            <svg
              v-if="i <= rating"
              class="w-4 h-4 text-yellow-300"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path
                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4 text-gray-300 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path
                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
              />
            </svg>
          </template>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <p>รีวิวเมื่อ {{ date }}</p>
        </div>
      </div>
    </div>
    <p class="mb-2 text-gray-500 dark:text-gray-400">
      {{ content }}
    </p>
  </article>
</template>
