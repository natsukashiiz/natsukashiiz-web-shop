<script setup lang="ts">
import type { VueCropperMethods } from "vue-cropperjs";

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  circle: {
    type: Boolean,
    default: false,
  },
});
const borderRadius = props.circle ? "50%" : "0";

const emit = defineEmits(["submit", "cancel"]);

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
          const file = new File([blob], "cropped-image.png", {
            type: "image/png",
          });
          emit("submit", file);

          if (cropper.value) {
            cropper.value.destroy();
          }
        }
      }, "image/png");
  }
};

const handleCancel = () => {
  emit("cancel");

  if (cropper.value) {
    cropper.value.destroy();
  }
};
const handleResetCrop = () => {
  if (cropper.value) {
    cropper.value.reset();
  }
};
</script>

<template>
  <UCard>
    <div class="h-full">
      <VueCropper
        ref="cropper"
        :src="imageUrl"
        :aspect-ratio="1"
        :view-mode="2"
        auto-crop-area="1"
      />
    </div>
    <template #footer>
      <div class="flex justify-between">
        <div class="flex space-x-1">
          <UTooltip text="รีเซ็ต">
            <UButton @click="handleResetCrop" color="white">
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
          <UButton @click="handleCancel" color="white">ยกเลิก</UButton>
          <UButton @click="handleCropImage">บันทึก</UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>

<style>
.cropper-view-box {
  box-shadow: 0 0 0 1px #39f;
  border-radius: v-bind(borderRadius);
  outline: 0;
}
.cropper-face {
  background-color: inherit !important;
}
.cropper-view-box {
  outline: inherit !important;
}
</style>
