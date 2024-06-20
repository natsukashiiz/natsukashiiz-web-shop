<script setup lang="ts">
import type { CartItemResponse } from "~/types";

const props = defineProps({
  item: {
    type: Object as () => CartItemResponse,
    required: true,
  },
  maxQuantity: {
    type: Number,
    required: true,
  },
});

const disabled = computed(() => {
  return props.maxQuantity < props.item.quantity;
});
</script>
<template>
  <li
    class="flex flex-row space-y-3 space-x-4 py-6 text-left sm:space-x-5 sm:space-y-0"
  >
    <div class="flex items-center">
      <UCheckbox
        :model-value="item.selected"
        @change="$emit('selected', item)"
        :disabled="disabled"
      />
    </div>
    <div class="shrink-0">
      <img
        class="h-24 w-24 max-w-full rounded-lg object-cover"
        :src="item.product.thumbnail"
        :alt="item.product.thumbnail"
      />
    </div>

    <div class="relative flex flex-1 flex-col justify-between">
      <div class="sm:col-gap-5 sm:grid sm:grid-cols-2">
        <div class="pr-8 sm:pr-5">
          <p class="text-base font-semibold text-gray-900 line-clamp-1">
            {{ item.productName }}
          </p>
          <p class="mx-0 mt-1 mb-0 text-sm text-gray-400">
            {{ item.optionName }}
          </p>
          <p
            class="mx-0 mt-1 mb-0 text-sm text-red-500"
            v-if="maxQuantity === 0"
          >
            สินค้าหมด
          </p>
          <p class="mx-0 mt-1 mb-0 text-sm text-red-500" v-else-if="disabled">
            สินค้าไม่เพียงพอ
          </p>
        </div>

        <div
          class="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end"
        >
          <p
            class="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right"
          >
            ฿<ACurrency :amount="item.price * item.quantity" />
          </p>

          <div class="sm:order-1">
            <div class="mx-auto flex h-8 items-stretch text-gray-600">
              <UButton
                icon="i-heroicons-minus"
                color="white"
                size="xs"
                class="rounded-r-none ring-0 border disabled:bg-gray-100"
                @click="
                  item.quantity > 1 ? $emit('update', --item.quantity) : null
                "
                :disabled="item.quantity <= 1 || disabled"
              />
              <UInput
                v-model="item.quantity"
                @change="$emit('update', $event)"
                variant="none"
                :ui="{
                  base: 'w-12 text-center',
                  rounded: 'rounded-none',
                  color: {
                    white: {
                      outline: 'ring-0 focus:ring0',
                    },
                  },
                }"
              />
              <UButton
                icon="i-heroicons-plus"
                color="white"
                size="xs"
                class="rounded-l-none ring-0 border disabled:bg-gray-100"
                @click="$emit('update', ++item.quantity)"
                :disabled="item.quantity >= item.maxQuantity || disabled"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
        <button
          type="button"
          class="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900"
          @click="$emit('remove')"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
              class=""
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </li>
</template>
