<script setup lang="ts">
const rating = defineModel<number>({ default: 0 });
const hoverRating = ref(0);
const isHovering = ref(false);

function rate(star: number) {
  rating.value = star;
}
const handleHover = (star: number) => {
  isHovering.value = true;
  hoverRating.value = star;
};
const handleLeave = () => {
  isHovering.value = false;
  hoverRating.value = 0;
};
</script>
<template>
  <div class="flex items-center space-x-1">
    <svg
      v-for="star in 5"
      :key="star"
      @click="rate(star)"
      @mouseover="handleHover(star)"
      @mouseleave="handleLeave()"
      :class="{
        'text-yellow-400': isHovering ? hoverRating >= star : rating >= star,
        'text-gray-300': isHovering ? hoverRating < star : rating < star,
      }"
      class="w-4 h-4 star cursor-pointer transition-colors duration-200"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path
        d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
      />
    </svg>
  </div>
</template>
