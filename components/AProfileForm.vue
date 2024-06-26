<script setup lang="ts">
import type { ProfileResponse, UpdateProfileRequest } from "~/types";
import { uploadFile } from "~/api/file";
import { updateProfile, deleteAvatar } from "~/api/profile";
import type { FormError, FormSubmitEvent } from "#ui/types";
import type { VueCropperMethods } from "vue-cropperjs";

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

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
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

const modalCropper = ref(false);
const handleShowCropper = () => {
  if (currentFile.value && form.avatar) modalCropper.value = true;
};
const handleCloseCropper = () => {
  modalCropper.value = false;
  if (cropper.value) {
    cropper.value.destroy();
  }
  resetAvatar();
};

const cropper = ref<VueCropperMethods | null>(null);
const handleCropImage = () => {
  if (cropper.value) {
    cropper.value
      .getCroppedCanvas({
        width: 300,
        height: 300,
        fillColor: "#fff",
        imageSmoothingEnabled: false,
        imageSmoothingQuality: "high",
      })
      .toBlob((blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], "cropped-avatar.png", {
            type: "image/png",
          });
          currentFile.value = file;
          avatar.value = URL.createObjectURL(file);
        }
      }, "image/png");
  }
  modalCropper.value = false;
  form.avatar = null;
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
      form.nickName == props.profile.nickName)
  );
});
</script>

<template>
  <UModal v-model="modalCropper">
    <UCard>
      <div class="h-full">
        <VueCropper
          ref="cropper"
          :src="avatar"
          :aspect-ratio="1"
          :view-mode="2"
          auto-crop-area="1"
        />
      </div>
      <template #footer>
        <div class="flex justify-between">
          <div class="flex space-x-1">
            <UTooltip text="รีเซ็ต">
              <UButton @click="resetAvatar" color="white">
                <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
              </UButton>
            </UTooltip>
            <UTooltip text="หมุนซ้าย">
              <UButton @click="() => cropper?.rotate(-90)" color="white">
                <Icon name="grommet-icons:rotate-left" class="w-4 h-4" />
              </UButton>
            </UTooltip>
            <UTooltip text="หมุนขวา">
              <UButton @click="() => cropper?.rotate(90)" color="white">
                <Icon name="grommet-icons:rotate-right" class="w-4 h-4" />
              </UButton>
            </UTooltip>
          </div>
          <div class="flex space-x-1">
            <UButton @click="handleCloseCropper" color="white">ยกเลิก</UButton>
            <UButton @click="handleCropImage">บันทึก</UButton>
          </div>
        </div>
      </template>
    </UCard>
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
        <UFormGroup help="ไฟล์ jpeg, png และขนาดไม่เกิน 1MB">
          <div class="flex flex-row justify-center">
            <UTooltip text="คลิกเพื่อเลือกรูป" @click="handleFileInput">
              <UAvatar
                :src="avatar || profile.avatar"
                :alt="profile.nickName.toUpperCase()"
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
          name="nickName"
          help="ตัวอักษรหรือตัวเลข 4-20 ตัว"
        >
          <UInput
            icon="i-heroicons-user"
            v-model="form.nickName"
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
<style>
.cropper-view-box {
  box-shadow: 0 0 0 1px #39f;
  border-radius: 50%;
  outline: 0;
}
.cropper-face {
  background-color: inherit !important;
}
.cropper-view-box {
  outline: inherit !important;
}
</style>
