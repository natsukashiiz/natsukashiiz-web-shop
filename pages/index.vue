<script setup lang="ts">
import type { ProductResponse } from "~/types";
import { getPageProduct } from "~/api/product";

const loading = useLoading();
const route = useRoute();

const products = ref<ProductResponse[]>([]);
const pagination = reactive({
  page: 1,
  limit: 20,
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

const scroll = () => {
  window.onscroll = async () => {
    let bottomOfWindow =
      Math.round(
        Math.max(
          window.scrollY,
          document.documentElement.scrollTop,
          document.body.scrollTop
        ) + window.innerHeight
      ) === document.documentElement.offsetHeight;

    if (bottomOfWindow) {
      if (products.value.length < pagination.total) {
        pagination.page++;
        await loadData();
      }
    }
  };
};

onMounted(async () => {
  if (route.query.page) {
    pagination.page = Number(route.query.page);
  }

  await loadData();
  //   scroll();
});
</script>
<template>
  <UContainer class="flex flex-col gap-y-2 p-5">
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
  </UContainer>
</template>
