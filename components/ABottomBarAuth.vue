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
    icon: "i-heroicons-ticket",
    to: "vouchers",
  },
  {
    label: "ตะกร้า",
    icon: "i-heroicons-shopping-cart",
    to: "cart",
  },
];

const isCurrent = (to: string) => route.name.includes(to);
</script>

<template>
  <div
    class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 block md:hidden"
  >
    <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
      <template v-for="menu in items" :key="menu.to">
        <button
          type="button"
          class="inline-flex flex-col items-center justify-center px-5 text-base text-gray-500"
          :class="{ 'text-primary-500': isCurrent(menu.to) }"
          @click="$router.push({ name: menu.to })"
        >
          <UIcon :name="menu.icon" class="text-2xl" />
          {{ menu.label }}
        </button>
      </template>
      <!-- profile menu -->
      <AAccountMenu>
        <template #button>
          <button
            type="button"
            class="inline-flex flex-col items-center justify-center px-5 text-base text-gray-500"
            :class="{ 'text-primary-500': isCurrent('profile') }"
          >
            <UIcon name="i-heroicons-user" class="text-2xl" />
            โปรไฟล์
          </button>
        </template>
      </AAccountMenu>
    </div>
  </div>
</template>
