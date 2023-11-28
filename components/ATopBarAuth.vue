<script setup lang="ts">
const authStore = useAuthStore();

const menus = [
  {
    label: "หน้าหลัก",
    to: "/",
  },
  {
    label: "ตะกร้าสินค้า",
    to: "/cart",
  },
  {
    label: "รายการสั่งซื้อ",
    to: "/orders/history",
  },
  {
    label: "ที่อยู่จัดส่ง",
    to: "/address",
  },
];

const { isMobile } = useDevice();
const navClass = isMobile
  ? "flex-1 justify-between items-center bg-slate-50 bg-opacity-60 py-2 px-2 h-26 border-b-[1.5px] border-slate-200"
  : "flex justify-between items-center bg-slate-50 bg-opacity-60 py-2 px-5 h-16 border-b-[1.5px] border-slate-200";

const modalLogout = ref(false);

const handleLogout = () => {
  authStore.logout();
  modalLogout.value = false;
};
</script>
<template>
  <div class="fixed z-[9999] w-full backdrop-blur-sm">
    <AModal
      title="ออกจากระบบ"
      label="ยืนยันการออกจากระบบ"
      :modal="modalLogout"
      confirm-text="ยืนยัน"
      cancel-text="ยกเลิก"
      @confirm="handleLogout"
      @close="modalLogout = false"
    />
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
        <UButton color="white" variant="solid" @click="modalLogout = true">
          ออกจากระบบ
        </UButton>
      </div>
    </nav>
  </div>
</template>
