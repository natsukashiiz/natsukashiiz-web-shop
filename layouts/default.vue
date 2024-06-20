<script setup lang="ts">
const colorMode = useColorMode();
colorMode.preference = "light";
</script>
<template>
  <NuxtLoadingBar />
  <UNotifications
    :ui="{ position: '-top-2 md:top-12 bottom-auto right-0 left-0 mx-auto' }"
  />
  <a-top-bar />
  <div class="pb-24 md:pt-14 min-h-screen">
    <NuxtPage keepalive />
  </div>
  <a-bottom-bar />
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
