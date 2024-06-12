<script setup lang="ts">
import type { ProductResponse } from "~/types";

defineProps<{
  product: ProductResponse;
}>(); // รับค่า props มาจากหน้าอื่น
</script>
<template>
  <UCard class="relative">
    <div class="absolute top-2 right-2">
      <AProductBadge :orders="product.orders" :created-at="product.createdAt" />
    </div>
    <a-product-image :src="product.thumbnail" />
    <template #footer>
      <h5
        class="text-xl font-semibold tracking-tight text-gray-900 text-pretty"
      >
        {{ product.name }}
      </h5>
      <div class="flex items-center justify-between mt-2">
        <span class="text-xl font-bold text-gray-600">
          ฿<ACurrency :amount="product.options[0].price" />
        </span>
        <UButton
          color="white"
          :to="{
            name: 'products-id',
            params: { id: product.id },
          }"
        >
          รายละเอียด
        </UButton>
      </div>
    </template>
  </UCard>
</template>
