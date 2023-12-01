<script setup lang="ts">
const { isMobile } = useDevice();
const divClass = isMobile ? "pt-24 min-h-screen" : "pt-14 min-h-screen";
</script>
<template>
  <NuxtLoadingBar />
  <a-top-bar />
  <div :class="divClass">
    <slot />
  </div>
  <UNotifications />
</template>
<style>
body {
  font-family: Mitr, sans-serif;
}
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
