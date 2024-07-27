<script setup lang="ts">
import type { ProductResponse } from "~/types";
import { getPageProduct } from "~/api/product";

const loading = useLoading();
const route = useRoute();
const router = useRouter();
const { isMobile } = useDevice();

const products = ref<ProductResponse[]>([]);
const pagination = reactive({
  page: 1,
  limit: isMobile ? 10 : 20,
  total: 0,
});

const loadData = async () => {
  loading.value = true;
  const res = await getPageProduct({
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

const changePage = async () => {
  //   const currentPage = route.query.page ? Number(route.query.page) : 1;
  //   if (currentPage !== pagination.page) {
  //     await loadData();
  //   }

  await loadData();
};

if (route.query.page) {
  pagination.page = Number(route.query.page);
}

await loadData();
</script>
<template>
  <div
    class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
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
      @click="changePage"
      :active-button="{ variant: 'outline' }"
      :inactive-button="{ color: 'gray' }"
    />
  </div>
</template>
