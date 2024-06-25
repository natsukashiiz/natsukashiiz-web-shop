<script setup lang="ts">
import type { ProfileResponse } from "~/types";

defineProps({
  profile: {
    type: Object as PropType<ProfileResponse>,
    required: true,
  },
});
</script>

<template>
  <UCard>
    <template #header>
      <span class="text-lg font-semibold text-gray-900"> ข้อมูลส่วนตัว </span>
    </template>

    <template #default>
      <UForm class="space-y-4">
        <div class="flex flex-row justify-center">
          <UAvatar
            :src="profile.avatar"
            :alt="profile.nickName.toUpperCase()"
            size="3xl"
          />
        </div>
        <UFormGroup label="avatar">
          <UInput :value="profile.avatar" type="file" />
        </UFormGroup>
        <UFormGroup label="อีเมล">
          <UInput icon="i-heroicons-envelope" :value="profile.email" disabled />
        </UFormGroup>
        <UFormGroup label="ชื่อผู้ใช้งาน">
          <UInput icon="i-heroicons-user" :value="profile.nickName" disabled />
        </UFormGroup>
        <UButton type="submit" color="white" block>
          แก้ไขข้อมูลส่วนตัว
        </UButton>
      </UForm>
    </template>
  </UCard>
</template>
