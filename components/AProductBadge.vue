<script setup lang="ts">
const props = defineProps({
  orders: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

const isNew = computed(() => {
  const today = new Date();
  const createdAt = new Date(props.createdAt);
  const diffTime = Math.abs(today.getTime() - createdAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
});
</script>
<template>
  <UBadge color="red" variant="subtle" v-if="orders >= 5"> สินค้าขายดี </UBadge>
  <UBadge color="blue" variant="subtle" v-else-if="isNew">ใหม่</UBadge>
</template>
