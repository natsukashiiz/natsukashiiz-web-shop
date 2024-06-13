<script setup lang="ts">
import { getAllCategory } from "~/api/category";
import type { CategoryResponse } from "~/types";

const categories = ref<CategoryResponse[]>([]);

const loadCategory = async () => {
  const res = await getAllCategory();
  if (res.status === 200 && res.data) {
    categories.value = res.data;
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

await loadCategory();
</script>
<template>
  <UCard>
    <div class="flex flex-wrap space-x-2 items-center">
      <div v-for="category in categories" :key="category.id" class="w-20">
        <NuxtImg
          :src="category.thumbnail"
          :alt="category.name"
          class="object-cover rounded-full hover:border-2 hover:border-rose-300"
        />
        <div
          class="mt-2 text-sm text-center text-nowrap text-ellipsis overflow-hidden"
        >
          {{ category.name }}
        </div>
      </div>
    </div>
  </UCard>
</template>
