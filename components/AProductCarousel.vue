<script setup lang="ts">
const { preview } = defineProps({
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
  preview: {
    type: Boolean,
    default: true,
  },
});
const isOpen = ref(false);
const handlePreview = () => {
  if (preview) {
    isOpen.value = true;
  }
};
</script>
<template>
  <UCarousel
    v-slot="{ item, index }"
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
    class="w-64 mx-auto"
  >
    <UTooltip text="คลิกเพื่อดูรูป">
      <a-product-image
        :src="item"
        @click="handlePreview"
        class="cursor-pointer hover:opacity-80 transition-opacity duration-300"
      />
    </UTooltip>
  </UCarousel>
  <UModal v-model="isOpen" :ui="{ overlay: { background: 'bg-gray-200/80' } }">
    <AProductImagePreview :items="items" />
  </UModal>
</template>
