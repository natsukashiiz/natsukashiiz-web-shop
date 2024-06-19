<script setup lang="ts">
import type { OrderResponse } from "~/types";

defineProps({
  item: {
    type: Object as () => OrderResponse,
    required: true,
  },
});
</script>
<template>
  <li
    class="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0 relative"
  >
    <div class="shrink-0">
      <img
        class="h-24 w-24 max-w-full rounded-lg object-cover"
        :src="item.items[0].productThumbnail"
        :alt="item.items[0].productName"
      />
    </div>

    <div class="relative flex flex-1 flex-col justify-between">
      <div class="sm:col-gap-5 sm:grid sm:grid-cols-2">
        <div class="pr-8 sm:pr-5">
          <p class="text-base font-semibold text-gray-900">
            {{ item.items[0].productName }}
          </p>
          <p class="mx-0 mt-1 mb-0 text-sm text-gray-400">
            {{ item.items[0].optionName }}
          </p>
          <p class="mx-0 mt-1 mb-0 text-sm text-gray-400">
            ฿<a-currency :amount="item.items[0].price" />
          </p>
        </div>

        <div
          class="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end"
        >
          <p
            class="shrink-0 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right"
          >
            สถานะ : <a-order-status :status="item.status" />
          </p>
        </div>
      </div>
    </div>
    <NuxtLink
      :to="{
        name: 'profile-orders-detail-orderId',
        params: { orderId: item.orderId },
      }"
      class="absolute bottom-2 right-0 text-sm text-gray-400 hover:text-blue-500"
    >
      ดูรายละเอียดเพิ่มเติม
    </NuxtLink>
  </li>
</template>
