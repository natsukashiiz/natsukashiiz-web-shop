<script setup lang="ts">
defineProps({
  amount: {
    type: Number,
    required: false,
    default: 0,
  },
});
</script>
<template>
  <span>{{ new Intl.NumberFormat().format(amount) }}</span>
</template>
