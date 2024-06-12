<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true,
  },
});

import placeholder from "~/assets/img/image-placeholder.svg";
</script>
<template>
  <NuxtImg
    :src="src"
    width="512"
    height="512"
    loading="lazy"
    :placeholder="placeholder"
  />
</template>
