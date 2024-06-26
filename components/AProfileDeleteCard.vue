<script setup lang="ts">
import { deleteAccount } from "~/api/profile";

const authStore = useAuthStore();
const modalDeleteAccount = ref(false);

const handleDeleteAccount = async () => {
  try {
    const res = await deleteAccount();
    if (res.status === 200) {
      authStore.logout();
      modalDeleteAccount.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <AModal
    title="ลบบัญชี"
    label="ยืนยันการลบบัญชี"
    description="คุณต้องการลบบัญชีของคุณหรือไม่ ถ้าคุณลบบัญชีของคุณ ข้อมูลของคุณจะถูกลบอย่างถาวรและไม่สามารถกู้คืนได้"
    :modal="modalDeleteAccount"
    confirm-text="ยืนยัน"
    cancel-text="ยกเลิก"
    @confirm="handleDeleteAccount"
    @close="modalDeleteAccount = false"
    confirmColor="red"
  />

  <UCard>
    <template #header>
      <span class="text-lg font-semibold text-gray-900"> การจัดการบัญชี </span>
    </template>

    <template #default>
      <UButton
        class="mt-2"
        icon="i-heroicons-trash"
        color="red"
        block
        @click="modalDeleteAccount = true"
      >
        ลบบัญชี
      </UButton>
    </template>
  </UCard>
</template>
