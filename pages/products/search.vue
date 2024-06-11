<script setup lang="ts">
import type { ProductResponse } from "~/types";
import { getProduct } from "~/api/product";

const loading = useLoading();
const route = useRoute();

const products = ref<ProductResponse[]>([]);
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
});
const categoryName = ref<string | undefined>(undefined);
const productName = ref<string | undefined>(undefined);

const loadData = async () => {
  loading.value = true;
  const res = await getProduct({
    name: productName.value,
    description: productName.value,
    "category.name": categoryName.value,
    page: pagination.page,
    size: pagination.limit,
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

onMounted(async () => {
  if (route.query.page) {
    pagination.page = Number(route.query.page);
  }

  if (route.query.categoryName) {
    categoryName.value = (route.query as any).categoryName;
  }

  if (route.query.name) {
    productName.value = (route.query as any).name;
  }

  await loadData();
});
</script>
<template>
  <UContainer class="flex flex-col gap-y-2 p-5">
    <span v-if="productName" class="text-2xl"> Search: {{ productName }} </span>
    <span v-if="categoryName" class="text-2xl">
      <UBadge color="white" variant="solid" size="lg">
        Category: {{ categoryName }}
      </UBadge>
    </span>

    <template v-if="!loading">
      <template v-if="products.length > 0">
        <div
          class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 grid-rows-2 gap-3"
        >
          <template v-for="item in products" :key="item.id">
            <AProductCard :product="item" />
          </template>
        </div>
        <UDivider class="my-2" />
        <div class="flex justify-end">
          <UPagination
            v-model="pagination.page"
            :page-count="pagination.limit"
            :total="pagination.total"
            @click="
              () => {
                $router.push({ query: { page: pagination.page } });
                loadData();
              }
            "
            :active-button="{ variant: 'outline' }"
            :inactive-button="{ color: 'gray' }"
          />
        </div>
      </template>
      <template v-else>
        <div class="flex justify-center">
          <div class="text-2xl">ไม่พบข้อมูล</div>
        </div>
      </template>
    </template>
  </UContainer>
</template>
