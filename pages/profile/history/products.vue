<script setup lang="ts">
import type {
  ProductViewHistoryResponse,
  OptionResponse,
  ProductResponse,
} from "~/types";
import { getViewHistory } from "~/api/product";
import { currencyFormat } from "~/utils";

const loading = useLoading();

const products = ref<ProductViewHistoryResponse[]>([]);
const pagination = reactive({
  page: 1,
  limit: 5,
  total: 0,
});

const loadData = async () => {
  loading.value = true;
  const res = await getViewHistory({
    page: pagination.page,
    size: pagination.limit,
    sort: "createdAt,desc",
  });

  if (res.status === 200 && res.data) {
    // products.value.push(...res.data.list);
    products.value = res.data.list;
    pagination.total = res.data.total;
    // window.scrollTo(0, 0);
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
  loading.value = false;
};

const optionMaxPrice = (options: OptionResponse[]) => {
  return Math.max(...options.map((option) => option.price));
};

const optionMinPrice = (options: OptionResponse[]) => {
  return Math.min(...options.map((option) => option.price));
};

const productPriceText = (product: ProductResponse) => {
  const maxPrice = optionMaxPrice(product.options);
  const minPrice = optionMinPrice(product.options);

  if (maxPrice === minPrice) {
    return `฿${currencyFormat(maxPrice)}`;
  }

  return `฿${currencyFormat(minPrice)} - ฿${currencyFormat(maxPrice)}`;
};

onActivated(() => {
  loadData();
});
</script>

<template>
  <UContainer class="max-w-3xl py-5">
    <UCard class="py-2" v-if="products.length > 0">
      <template #header>
        <span class="text-lg font-semibold text-gray-900">
          ประวัติการเข้าชมสินค้า
        </span>
      </template>
      <ul class="-my-8">
        <template v-for="(item, index) in products" :key="item.id">
          <li
            class="flex flex-col space-y-3 py-5 text-left sm:flex-row sm:space-x-5 sm:space-y-0 relative"
          >
            <div class="shrink-0">
              <img
                class="h-24 w-24 max-w-full rounded-lg object-cover"
                :src="item.product.thumbnail"
                :alt="item.product.name"
              />
            </div>

            <div class="relative flex flex-1 flex-col justify-between">
              <div class="sm:col-gap-5 sm:grid sm:grid-cols-2">
                <div class="pr-8 sm:pr-5">
                  <p class="text-base font-semibold text-gray-900">
                    {{ item.product.name }}
                  </p>
                  <p class="mx-0 mt-1 mb-0 text-sm text-gray-400">
                    {{ productPriceText(item.product) }}
                  </p>
                  <p class="mx-0 mt-1 mb-0 text-sm text-gray-400">
                    เมื่อ {{ item.createdAt }}
                  </p>
                </div>
              </div>
            </div>
            <NuxtLink
              :to="{
                name: 'products-id',
                params: { id: item.product.id },
              }"
              class="absolute bottom-2 right-0 text-sm text-gray-400 hover:text-blue-500"
            >
              ดูสินค้า
            </NuxtLink>
          </li>
          <UDivider v-if="index != products.length - 1" />
        </template>
      </ul>
    </UCard>
    <UCard v-else>
      <div class="px-4 py-6 sm:px-8 sm:py-10">
        <div class="flex flex-col items-center justify-center">
          <p class="text-xl font-semibold text-gray-900">
            ไม่มีประวัติการเข้าชมสินค้า
          </p>
        </div>
      </div>
    </UCard>
    <div class="flex justify-end mt-2">
      <UPagination
        v-model="pagination.page"
        :page-count="pagination.limit"
        :total="pagination.total"
        @click="loadData"
        :active-button="{ variant: 'outline' }"
        :inactive-button="{ color: 'gray' }"
      />
    </div>
  </UContainer>
</template>
