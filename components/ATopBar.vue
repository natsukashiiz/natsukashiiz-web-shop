<script setup lang="ts">
const authStore = useAuthStore();

const menus = [
  {
    label: "หน้าหลัก",
    to: "/",
    isAuth: false,
  },
  {
    label: "ตะกร้าสินค้า",
    to: "/cart",
    isAuth: true,
  },
  {
    label: "รายการสั่งซื้อ",
    to: "/orders/history",
    isAuth: true,
  },
];

const menuItems = computed(() => {
  return menus.filter((menu) => {
    if (menu.isAuth) {
      return authStore.isAuth;
    }
    return true;
  });
});

const { isMobile } = useDevice();
const navClass = isMobile
  ? "flex-1 justify-between items-center bg-rose-400 bg-opacity-60 py-2 px-2 h-26"
  : "flex justify-between items-center bg-rose-400 bg-opacity-60 py-2 px-5 h-16";

const modalLogout = ref(false);

const handleLogout = () => {
  authStore.logout();
  modalLogout.value = false;
};
</script>
<template>
  <UModal v-model="modalLogout">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            ออกจากระบบ
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="modalLogout = false"
          />
        </div>
      </template>

      <div class="py-2">
        <div class="text-center">
          <p class="text-sm text-gray-500">คุณต้องการออกจากระบบใช่หรือไม่</p>
        </div>
        <div class="flex justify-center space-x-4 mt-4">
          <button
            @click="modalLogout = false"
            class="text-black bg-white hover:bg-rose-100 focus:ring-2 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-2 py-2 text-center"
          >
            ยกเลิก
          </button>
          <button
            @click="handleLogout"
            class="text-black bg-white hover:bg-rose-100 focus:ring-2 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-2 py-2 text-center"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </UCard>
  </UModal>
  <div class="fixed z-[9999] w-full backdrop-blur-sm">
    <nav :class="navClass">
      <div class="flex items-center space-x-4">
        <ULink
          to="/"
          class="font-bold tracking-widest sm:text-sm lg:text-3xl text-white"
        >
          ร้านค้า
        </ULink>
      </div>
      <div class="flex items-center space-x-4">
        <template v-for="menu in menuItems" :key="menu.to">
          <ULink
            :to="menu.to"
            active-class="text-white font-bold border-b-2 border-white"
            inactive-class="text-white hover:text-gray-700"
          >
            {{ menu.label }}
          </ULink>
        </template>
        <button
          v-if="authStore.isAuth"
          @click="modalLogout = true"
          class="text-black bg-white hover:bg-rose-100 focus:ring-2 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-2 py-2 text-center"
        >
          ออกจากระบบ
        </button>
        <NuxtLink
          v-else
          to="/login"
          class="text-black bg-white hover:bg-rose-100 focus:ring-2 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-2 py-2 text-center"
        >
          เข้าสู่ระบบ
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>
