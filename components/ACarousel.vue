<script setup lang="ts">
import type { CarouselResponse } from "~/types";
import { getAllCarousel } from "~/api/carousel";

const carousels = ref<CarouselResponse[]>([]);
const carouselRef = ref();

const loadCarousel = async () => {
  const res = await getAllCarousel();
  if (res.status === 200 && res.data) {
    carousels.value = res.data;
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

await loadCarousel();

onNuxtReady(() => {
  setInterval(() => {
    if (!carouselRef.value) return;

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0);
    }

    carouselRef.value.next();
  }, 5000);
});
</script>
<template>
  <UCarousel
    ref="carouselRef"
    v-slot="{ item }"
    :items="carousels"
    :ui="{ item: 'basis-full' }"
    class="rounded-lg overflow-hidden"
    arrows
  >
    <img :src="item.imageUrl" class="w-full" draggable="false" />
  </UCarousel>
</template>
