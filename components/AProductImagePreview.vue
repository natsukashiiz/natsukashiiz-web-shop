<script setup lang="ts">
defineProps({
  items: {
    type: Array as PropType<String[]>,
    required: true,
  },
});
import placeholder from "~/assets/img/image-placeholder.svg";
</script>
<template>
  <UCarousel
    v-slot="{ item }"
    :items="items"
    :ui="{
      item: 'basis-full',
      container: 'rounded-lg',
    }"
    :prev-button="{
      color: 'gray',
      icon: 'i-heroicons-arrow-left-20-solid',
      class: '-left-12',
    }"
    :next-button="{
      color: 'gray',
      icon: 'i-heroicons-arrow-right-20-solid',
      class: '-right-12',
    }"
    arrows
    class="w-92 mx-auto"
  >
    <NuxtImg
      :src="item"
      width="512"
      height="512"
      loading="lazy"
      :placeholder="placeholder"
    />
  </UCarousel>
</template>
