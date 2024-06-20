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
      label: "รายการสั่งซื้อ",
      icon: "i-heroicons-list-bullet",
      to: "/profile/history/orders",
    },
    {
      label: "ที่อยู่จัดส่ง",
      icon: "i-heroicons-map-pin",
      to: "/profile/address",
    },
    {
      label: "รายการโปรด",
      icon: "i-heroicons-heart",
      to: "/profile/favorite",
    },
    {
      label: "ประวัติการเข้าชมสินค้า",
      icon: "i-heroicons-clock",
      to: "/profile/history/products",
    },
    {
      label: "ประวัติการเข้าสู่ระบบ",
      icon: "i-heroicons-clock",
      to: "/profile/history/login",
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
    :ui="{ width: 'w-44', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <slot name="button" />

    <template #account="{ item }">
      <div class="text-left">
        <p>เข้าสู่ระบบโดย</p>
        <p class="font-medium text-black truncate w-40">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <ULink v-if="item.to" :to="item.to" class="truncate">
        {{ item.label }}
      </ULink>
      <span v-else-if="item.onclick" @click="item.onclick()" class="truncate">
        {{ item.label }}
      </span>
      <span v-else class="truncate">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 ms-auto"
      />
    </template>
  </UDropdown>
</template>
