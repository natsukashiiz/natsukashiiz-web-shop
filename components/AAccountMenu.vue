<script setup>
const authStore = useAuthStore();

const items = [
  [
    {
      label: authStore.payload.email,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "ตะกร้าสินค้า",
      icon: "i-heroicons-shopping-cart",
      to: "/cart",
    },
    {
      label: "รายการสั่งซื้อ",
      icon: "i-heroicons-list-bullet",
      to: "/orders/history",
    },
    {
      label: "ที่อยู่จัดส่ง",
      icon: "i-heroicons-map-pin",
      to: "/address",
    },
  ],
  [
    {
      label: "ออกจากระบบ",
      icon: "i-heroicons-arrow-left-on-rectangle",
      onclick: () => (modalLogout.value = true),
    },
  ],
];

const modalLogout = ref(false);

const handleLogout = () => {
  authStore.logout();
  modalLogout.value = false;
};
</script>

<template>
  <AModal
    title="ออกจากระบบ"
    label="ยืนยันการออกจากระบบ"
    :modal="modalLogout"
    confirm-text="ยืนยัน"
    cancel-text="ยกเลิก"
    @confirm="handleLogout"
    @close="modalLogout = false"
  />
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar
      :alt="authStore.payload.email.toUpperCase()"
      class="border-2 border-rose-500 hover:border-rose-300 cursor-pointer"
    />

    <template #account="{ item }">
      <div class="text-left">
        <p>เข้าสู่ระบบโดย</p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <ULink v-if="item.to" :to="item.to">
        {{ item.label }}
      </ULink>
      <span v-else class="truncate">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>
