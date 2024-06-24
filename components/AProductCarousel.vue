<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array as PropType<string[]>,
    required: true,
  },
  preview: {
    type: Boolean,
    default: true,
  },
  current: {
    type: Number,
    default: 0,
  },
});

const isOpen = ref(false);
const handlePreview = () => {
  if (props.preview) {
    isOpen.value = true;
  }
};

const { isMobile } = useDevice();
const carouselRef = ref();

watch(
  () => props.current,
  (newValue, oldValue) => {
    if (!carouselRef.value) return;
    carouselRef.value.select(newValue);
  }
);
</script>
<template>
  <UCarousel
    ref="carouselRef"
    :items="items"
    :ui="{
      item: 'basis-full',
      container: 'rounded-lg',
      indicators: {
        wrapper: 'relative bottom-0 mt-4',
      },
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
    :arrows="!isMobile"
    :indicators="isMobile"
    class="w-64 mx-auto"
    :class="{ 'w-80': isMobile }"
  >
    <template #default="{ item }">
      <UTooltip text="คลิกเพื่อดูรูป">
        <a-product-image
          :src="item"
          @click="handlePreview"
          class="cursor-pointer hover:opacity-80 transition-opacity duration-300"
        />
      </UTooltip>
    </template>

    <template #indicator="{ onClick, page, active }">
      <UButton
        :label="String(page)"
        :variant="active ? 'solid' : 'outline'"
        size="2xs"
        class="rounded-full min-w-6 justify-center"
        @click="onClick(page)"
      />
    </template>
  </UCarousel>
  <UModal
    v-model="isOpen"
    :ui="{
      overlay: { background: 'bg-gray-200/80' },
      container: 'items-center',
    }"
  >
    <LazyAProductImagePreview :items="items" />
  </UModal>
</template>
