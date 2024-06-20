<script setup lang="ts">
import type { ProductResponse } from "~/types";

defineProps<{
  product: ProductResponse;
}>(); // รับค่า props มาจากหน้าอื่น
</script>
<template>
  <ULink
    :to="{
      name: 'products-id',
      params: { id: product.id },
    }"
  >
    <UCard
      class="relative ring-1 hover:ring-gray-400"
      :ui="{ body: { padding: '' }, footer: { padding: 'py-3 px-2 sm:px-4' } }"
    >
      <div class="absolute top-1 right-1">
        <AProductBadge
          :orders="product.orders"
          :created-at="product.createdAt"
        />
      </div>
      <a-product-image :src="product.thumbnail" class="rounded-t-lg" />
      <template #footer>
        <h5
          class="text-sm sm:text-lg font-semibold tracking-tight text-gray-900 text-pretty line-clamp-1"
        >
          {{ product.name }}
        </h5>
        <div class="flex items-center justify-between mt-2">
          <span class="text-sm sm:text-lg font-bold text-gray-600">
            ฿<ACurrency :amount="product.options[0].price" />
          </span>
          <!-- <UButton
          color="white"
          :to="{
            name: 'products-id',
            params: { id: product.id },
          }"
        >
          รายละเอียด
        </UButton> -->
        </div>
      </template>
    </UCard>
  </ULink>
</template>
