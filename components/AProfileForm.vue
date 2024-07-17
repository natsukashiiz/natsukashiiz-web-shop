<script setup lang="ts">
import type { ProfileResponse, UpdateProfileRequest } from "~/types";
import { uploadFile, deleteFile } from "~/api/file";
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
  username: props.profile.username,
  avatar: null,
});
const currentFile = ref<File | null>(null);

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    // validate file extension and size 512KB
    const validExtensions = ["image/jpeg", "image/png"];
    if (!validExtensions.includes(file.type)) {
      toast.add({
        title: "ไฟล์รูปภาพไม่รองรับ รองรับเฉพาะ jpeg และ png",
        color: "red",
        icon: "i-heroicons-x-circle",
        timeout: 3000,
      });
      return;
    }

    if (file.size > (1024 * 1024) / 2) {
      toast.add({
        title: "ไฟล์รูปภาพมีขนาดใหญ่เกิน 512KB",
        color: "red",
        icon: "i-heroicons-x-circle",
        timeout: 3000,
      });
      return;
    }

    currentFile.value = file;
    const url = URL.createObjectURL(file);
    avatar.value = url;
    modalCropper.value = true;
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

const handleDeleteFile = async () => {
  if (props.profile.avatar) {
    try {
      await deleteFile(props.profile.avatar);
    } catch (error) {
      console.error(error);
    }
  }
};

const validate = (state: UpdateProfileRequest): FormError[] => {
  const errors = [];
  if (
    !state.username ||
    state.username.length < 4 ||
    state.username.length > 20
  )
    errors.push({
      path: "username",
      message: "กรุณากรอกชื่อผู้ใช้งานให้ถูกต้อง",
    });
  return errors;
};

const handleUpdateProfile = async (
  event: FormSubmitEvent<UpdateProfileRequest>
) => {
  if (currentFile.value) {
    await handleDeleteFile();
    await handleUploadFile();
  }

  try {
    const res = await updateProfile({
      username: event.data.username,
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
      await handleDeleteFile();
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

const fileInputRef = ref<HTMLInputElement | null>(null);
const handleFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const disabledUpdateProfile = computed(() => {
  return (
    validate(form).length > 0 ||
    (avatar.value == props.profile.avatar &&
      form.username == props.profile.username)
  );
});

const modalCropper = ref(false);
const handleCloseCropper = () => {
  modalCropper.value = false;
  resetAvatar();
};
const handleSubmitCropper = (file: File) => {
  currentFile.value = file;
  avatar.value = URL.createObjectURL(file);
  modalCropper.value = false;
  form.avatar = null;
};
</script>

<template>
  <UModal v-model="modalCropper">
    <AImageCropper
      v-if="avatar"
      :image-url="avatar"
      :circle="true"
      @submit="handleSubmitCropper"
      @cancel="handleCloseCropper"
    />
  </UModal>

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
        <UFormGroup help="รองรับเฉพาะ jpeg, png และขนาดไม่เกิน 512KB">
          <div class="flex flex-row justify-center">
            <UTooltip text="คลิกเพื่อเลือกรูป" @click="handleFileInput">
              <UAvatar
                :src="avatar || profile.avatar"
                :alt="profile.username.toUpperCase()"
                size="3xl"
                class="cursor-pointer outline outline-2 outline-primary-400"
              />
            </UTooltip>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              style="display: none"
            />
          </div>
          <div class="flex space-x-2">
            <UTooltip text="รีเซ็ตรูปที่อัพโหลด">
              <UButton
                icon="i-heroicons-arrow-path"
                color="white"
                @click="resetAvatar"
                :disabled="!avatar"
              />
            </UTooltip>
            <UTooltip text="ลบรูปภาพโปรไฟล์ปัจจุบัน">
              <UButton
                icon="i-heroicons-trash"
                color="white"
                @click="handleDeleteAvatar"
                :disabled="!profile.avatar"
              />
            </UTooltip>
          </div>
        </UFormGroup>
        <UFormGroup label="อีเมล">
          <UInput icon="i-heroicons-envelope" :value="profile.email" disabled />
        </UFormGroup>
        <UFormGroup
          label="ชื่อผู้ใช้งาน"
          name="username"
          help="ตัวอักษรหรือตัวเลข 4-20 ตัว"
        >
          <UInput
            icon="i-heroicons-user"
            v-model="form.username"
            oninput="this.value=this.value.replace(/[^a-zA-Z0-9]/g,'')"
          />
        </UFormGroup>
        <UButton
          type="submit"
          color="white"
          block
          :disabled="disabledUpdateProfile"
        >
          แก้ไขข้อมูลส่วนตัว
        </UButton>
      </UForm>
    </template>
  </UCard>
</template>
