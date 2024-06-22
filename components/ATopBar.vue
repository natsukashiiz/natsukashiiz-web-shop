<script setup lang="ts">
const menus = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ส่วนลด",
    to: "/vouchers",
  },
];
</script>
<template>
  <div class="fixed z-[20] w-full backdrop-blur-sm hidden md:block">
    <nav
      class="flex justify-around items-center bg-slate-50 bg-opacity-60 py-2 px-5 h-16 border-b-[1.5px] border-slate-200"
    >
      <div class="flex items-center space-x-4">
        <ULink to="/">
          <img src="/icons/favicon.ico" class="w-8 h-8" />
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
