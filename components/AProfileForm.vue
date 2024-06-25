<script setup lang="ts">
import type { ProfileResponse } from "~/types";
import { uploadFile } from "~/api/file";

const props = defineProps({
  profile: {
    type: Object as PropType<ProfileResponse>,
    required: true,
  },
});

const toast = useToast();

const currentAvatar = ref<string | null>(props.profile.avatar);
const handleUploadFile = async (files: File[]) => {
  const file = files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    currentAvatar.value = url;

    // Upload file to server
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadFile(formData);
      if (res.status === 200) {
        toast.add({
          title: "อัพโหลดรูปภาพสำเร็จ",
          color: "green",
          icon: "i-heroicons-check-circle",
          timeout: 3000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
};
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
            :src="!!currentAvatar"
            :alt="profile.nickName.toUpperCase()"
            size="3xl"
          />
        </div>
        <UFormGroup label="รูปโปรไฟล์">
          <div class="flex space-x-2">
            <UInput
              :value="profile.avatar"
              type="file"
              @change="handleUploadFile"
              class="w-full"
            />
            <UTooltip text="ล้างอัพโหลดรูป">
              <UButton
                icon="i-heroicons-arrow-path"
                color="white"
                @click="currentAvatar = profile.avatar"
              />
            </UTooltip>
            <UTooltip text="ลบรูปภาพ">
              <UButton
                icon="i-heroicons-trash"
                color="white"
                @click="currentAvatar = null"
              />
            </UTooltip>
          </div>
        </UFormGroup>
        <UFormGroup label="อีเมล">
          <UInput icon="i-heroicons-envelope" :value="profile.email" disabled />
        </UFormGroup>
        <UFormGroup label="ชื่อผู้ใช้งาน">
          <UInput icon="i-heroicons-user" :value="profile.nickName" />
        </UFormGroup>
        <UButton type="submit" color="white" block>
          แก้ไขข้อมูลส่วนตัว
        </UButton>
      </UForm>
    </template>
  </UCard>
</template>
