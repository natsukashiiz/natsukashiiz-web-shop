<script setup lang="ts">
const authStore = useAuthStore();

const menus = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
];

const { isMobile } = useDevice();
const navClass = isMobile
  ? "flex-1 justify-between items-center bg-slate-50 bg-opacity-60 py-2 px-2 h-26 border-b-[1.5px] border-slate-200"
  : "flex justify-between items-center bg-slate-50 bg-opacity-60 py-2 px-5 h-16 border-b-[1.5px] border-slate-200";
</script>
<template>
  <div class="fixed z-[9999] w-full backdrop-blur-sm">
    <nav :class="navClass">
      <div class="flex items-center space-x-4">
        <ULink to="/" class="font-bold tracking-widest sm:text-sm lg:text-3xl">
          ร้านค้า
        </ULink>
      </div>
      <div class="flex items-center space-x-4">
        <template v-for="menu in menus" :key="menu.to">
          <ULink
            :to="menu.to"
            active-class="font-bold border-b-2 border-white"
            inactive-class="hover:text-gray-700"
          >
            {{ menu.label }}
          </ULink>
        </template>
        <AAccountMenu />
      </div>
    </nav>
  </div>
</template>
