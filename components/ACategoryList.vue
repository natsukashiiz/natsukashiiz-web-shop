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
  <div class="flex flex-wrap gap-2 justify-center">
    <template v-for="item in categories" :key="item.id">
      <UButton
        :label="item.name"
        :to="{
          name: 'products-search',
          query: {
            category: item.name,
          },
        }"
        variant="outline"
        color="gray"
        class="rounded-full hover:text-primary-400 transition-colors"
        size="sm"
      >
        <template #leading> <UAvatar :src="item.thumbnail" /> </template
      ></UButton>
    </template>
  </div>
</template>
