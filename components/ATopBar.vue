<script setup lang="ts">
import icon from "~/assets/img/shop-icon.png";

const menus = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
];

const { isMobile } = useDevice();
const navClass = isMobile
  ? "flex flex-col space-y-2 justify-between items-center bg-slate-50 bg-opacity-60 py-2 px-2 h-26 border-b-[1.5px] border-slate-200"
  : "flex justify-around items-center bg-slate-50 bg-opacity-60 py-2 px-5 h-16 border-b-[1.5px] border-slate-200";
</script>
<template>
  <div class="fixed z-[9999] w-full backdrop-blur-sm">
    <nav :class="navClass">
      <div class="flex items-center space-x-4">
        <ULink to="/">
          <img :src="icon" class="w-8 h-8" />
        </ULink>
        <template v-for="menu in menus" :key="menu.to">
          <ULink
            :to="menu.to"
            active-class="font-bold"
            inactive-class="hover:text-gray-700"
          >
            {{ menu.label }}
          </ULink>
        </template>
      </div>
      <div class="flex items-center space-x-4"></div>
      <div class="flex flex-row gap-2">
        <a-product-search />
        <UTooltip text="ตะกร้าสินค้า" placement="bottom">
          <UChip :show="false" size="2xl">
            <UButton
              icon="i-heroicons-shopping-cart"
              color="gray"
              :to="{
                name: 'login',
              }"
            />
          </UChip>
        </UTooltip>
        <div class="flex items-center space-x-4">
          <UButton color="white" variant="solid" :to="{ name: 'login' }">
            เข้าสู่ระบบ
          </UButton>
        </div>
      </div>
    </nav>
  </div>
</template>
