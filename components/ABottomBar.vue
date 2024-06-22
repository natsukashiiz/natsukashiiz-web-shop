<script setup lang="ts">
const route = useRoute();

const items = [
  {
    label: "หน้าหลัก",
    icon: "i-heroicons-home",
    to: "index",
  },
  {
    label: "ส่วนลด",
    icon: "i-heroicons-tag",
    to: "vouchers",
  },
  {
    label: "เข้าสู่ระบบ",
    icon: "i-heroicons-arrow-right-end-on-rectangle",
    to: "login",
  },
];

const isCurrent = (to: string) => route.name.includes(to);
</script>

<template>
  <div
    class="fixed bottom-0 left-0 z-50 w-full h-24 bg-white border-t border-gray-200 block md:hidden"
  >
    <div class="grid h-full max-w-lg grid-cols-3 mx-auto font-medium pb-8">
      <template v-for="menu in items" :key="menu.to">
        <button
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 text-base text-gray-500"
          :class="{ 'text-primary-500 font-medium': isCurrent(menu.to) }"
          @click="$router.push({ name: menu.to })"
        >
          <UIcon :name="menu.icon" class="text-2xl" />
          {{ menu.label }}
        </button>
      </template>
    </div>
  </div>
</template>
