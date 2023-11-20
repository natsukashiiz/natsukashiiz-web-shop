<script setup lang="ts">
const { isMobile } = useDevice();
const divClass = isMobile ? "pt-24 min-h-screen" : "pt-14 min-h-screen";

const colorMode = useColorMode();
colorMode.preference = "light";
</script>
<template>
  <a-top-bar></a-top-bar>
  <div :class="divClass">
    <slot />
  </div>
  <UDivider label="เว็บไซต์นี้จัดทำเพื่อการ..." />
</template>
<style>
body {
  font-family: Mitr, sans-serif;
}
</style>
