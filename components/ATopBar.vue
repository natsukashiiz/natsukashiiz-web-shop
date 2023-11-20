<script setup lang="ts">
const menus = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Login",
    to: "/login",
  },
];

const { isMobile } = useDevice();
const navClass = isMobile
  ? "flex-1 justify-between items-center bg-rose-400 bg-opacity-60 py-2 px-2 h-26"
  : "flex justify-between items-center bg-rose-400 bg-opacity-60 py-2 px-5 h-16";
</script>
<template>
  <div class="fixed z-[9999] w-full backdrop-blur-sm">
    <nav :class="navClass">
      <div class="flex items-center space-x-4">
        <ULink
          to="/"
          class="font-bold tracking-widest sm:text-sm lg:text-3xl text-white"
          >Shop</ULink
        >
      </div>
      <div class="flex items-center space-x-4">
        <template v-for="menu in menus" :key="menu.label">
          <ULink
            :to="menu.to"
            active-class="text-white font-bold border-b-2 border-white"
            inactive-class="text-white hover:text-gray-700"
            >{{ menu.label }}</ULink
          >
        </template>
      </div>
    </nav>
  </div>
</template>
