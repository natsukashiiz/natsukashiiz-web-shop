<script setup lang="ts">
import type { ProductResponse } from "~/types";

defineProps<{
  product: ProductResponse;
}>(); // รับค่า props มาจากหน้าอื่น
</script>
<template>
  <UCard class="relative">
    <div class="absolute top-4 right-2">
      <AProductBadge :orders="product.orders" :created-at="product.createdAt" />
    </div>
    <img
      class="p-2 rounded-t-lg w-full h-52 object-cover"
      :src="product.thumbnail"
      alt="product image"
    />
    <template #footer>
      <h5 class="text-xl font-semibold tracking-tight text-gray-900">
        {{ product.name }}
      </h5>
      <div class="flex items-center justify-between mt-2">
        <span class="text-xl font-bold text-gray-600">
          ฿<ACurrency :amount="product.options[0].price" />
        </span>
        <UButton color="white" :to="`/products/${product.id}`">
          รายละเอียด
        </UButton>
      </div>
    </template>
  </UCard>
</template>
