<script setup lang="ts">
import type { ProfileResponse, UpdateProfileRequest } from "~/types";
import { uploadFile } from "~/api/file";
import { updateProfile, deleteAvatar } from "~/api/profile";
import type { FormError, FormSubmitEvent } from "#ui/types";

const props = defineProps({
  profile: {
    type: Object as PropType<ProfileResponse>,
    required: true,
  },
});

const emit = defineEmits(["updateProfile"]);

const toast = useToast();
const avatar = ref<string | null>(props.profile.avatar);
const form = reactive<UpdateProfileRequest>({
  nickName: props.profile.nickName,
  avatar: null,
});
const currentFile = ref<File | null>(null);

const handleFileChange = async (files: File[]) => {
  const file = files[0];
  if (file) {
    currentFile.value = file;
    const url = URL.createObjectURL(file);
    avatar.value = url;
  }
};
const handleUploadFile = async () => {
  if (currentFile.value) {
    try {
      const formData = new FormData();
      formData.append("file", currentFile.value);
      const res = await uploadFile(formData);
      if (res.status === 200) {
        avatar.value = res.data.url;
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const validate = (state: UpdateProfileRequest): FormError[] => {
  const errors = [];
  if (
    !state.nickName ||
    state.nickName.length < 4 ||
    state.nickName.length > 20
  )
    errors.push({
      path: "nickName",
      message: "กรุณากรอกชื่อผู้ใช้งานให้ถูกต้อง",
    });
  return errors;
};

const handleUpdateProfile = async (
  event: FormSubmitEvent<UpdateProfileRequest>
) => {
  if (currentFile.value) {
    await handleUploadFile();
  }

  try {
    const res = await updateProfile({
      nickName: event.data.nickName,
      avatar: avatar.value,
    });

    if (res.status === 200) {
      emit("updateProfile", res.data);
      toast.add({
        title: "แก้ไขข้อมูลส่วนตัวสำเร็จ",
        color: "green",
        icon: "i-heroicons-check-circle",
        timeout: 3000,
      });
    }
  } catch (error) {}
};

const resetAvatar = () => {
  avatar.value = props.profile.avatar;
  form.avatar = null;
};

const handleDeleteAvatar = async () => {
  try {
    const res = await deleteAvatar();
    if (res.status === 200) {
      emit("updateProfile", res.data);
      avatar.value = null;
      currentFile.value = null;
      toast.add({
        title: "ลบรูปภาพสำเร็จ",
        color: "green",
        icon: "i-heroicons-check-circle",
        timeout: 3000,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <UCard>
    <template #header>
      <span class="text-lg font-semibold text-gray-900"> ข้อมูลส่วนตัว </span>
    </template>

    <template #default>
      <UForm
        class="space-y-4"
        :validate="validate"
        :state="form"
        @submit="handleUpdateProfile"
      >
        <div class="flex flex-row justify-center">
          <UAvatar
            :src="avatar || profile.avatar"
            :alt="profile.nickName.toUpperCase()"
            size="3xl"
          />
        </div>
        <UFormGroup label="รูปโปรไฟล์">
          <div class="flex space-x-2">
            <UInput
              v-model="form.avatar"
              type="file"
              @change="handleFileChange"
              class="w-full"
            />
            <UTooltip text="ล้างอัพโหลดรูป">
              <UButton
                icon="i-heroicons-arrow-path"
                color="white"
                @click="resetAvatar"
              />
            </UTooltip>
            <UTooltip text="ลบรูปภาพ">
              <UButton
                icon="i-heroicons-trash"
                color="white"
                @click="handleDeleteAvatar"
              />
            </UTooltip>
          </div>
        </UFormGroup>
        <UFormGroup label="อีเมล">
          <UInput icon="i-heroicons-envelope" :value="profile.email" disabled />
        </UFormGroup>
        <UFormGroup
          label="ชื่อผู้ใช้งาน"
          name="nickName"
          help="ตัวอักษรหรือตัวเลข 4-20 ตัว"
        >
          <UInput
            icon="i-heroicons-user"
            v-model="form.nickName"
            oninput="this.value=this.value.replace(/[^a-zA-Z0-9]/g,'')"
          />
        </UFormGroup>
        <UButton type="submit" color="white" block>
          แก้ไขข้อมูลส่วนตัว
        </UButton>
      </UForm>
    </template>
  </UCard>
</template>
