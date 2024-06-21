<script setup lang="ts">
const props = defineProps({
  modal: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  label: {
    type: String || undefined,
    required: false,
  },
  description: {
    type: String || undefined,
    required: false,
  },
  confirmColor: {
    type: String,
    required: false,
    default: "primary",
  },
  cancelColor: {
    type: String,
    required: false,
    default: "gray",
  },
  confirmText: {
    type: String,
    required: false,
    default: "ยืนยัน",
  },
  cancelText: {
    type: String,
    required: false,
    default: "ยกเลิก",
  },
  loadingConfirm: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabledConfirm: {
    type: Boolean,
    required: false,
    default: false,
  },
  image: {
    type: String || undefined,
    required: false,
  },
  footer: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const isOpen = ref(false);

watchEffect(() => {
  isOpen.value = props.modal;
});
</script>
<template>
  <UModal v-model="isOpen">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium" v-text="title" />
          <button
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            @click="$emit('close')"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </template>

      <div class="flex flex-col space-y-4" v-if="label || description">
        <p class="text-lg font-medium" v-if="label" v-text="label" />
        <p class="text-gray-400" v-if="description" v-text="description" />
      </div>

      <div class="flex justify-center" v-if="image">
        <img :src="image" class="w-80 h-full object-cover rounded-lg" />
      </div>

      <slot />

      <template #footer v-if="footer">
        <div class="flex justify-end space-x-2">
          <UButton
            :color="cancelColor"
            @click="$emit('close')"
            :ui="{
              ring: '',
              divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }"
          >
            {{ cancelText }}
          </UButton>
          <UButton
            :color="confirmColor"
            :disabled="disabledConfirm"
            :loading="loadingConfirm"
            @click="$emit('confirm')"
            :ui="{
              ring: '',
              divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }"
          >
            {{ confirmText }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
