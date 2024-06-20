<script setup lang="ts">
import type { ProductResponse } from "~/types";
import { getProduct } from "~/api/product";
import type { LocationQuery } from "vue-router";

const loading = useLoading();
const route = useRoute();
const { isMobile } = useDevice();

const products = ref<ProductResponse[]>([]);
const pagination = reactive({
  page: 1,
  limit: isMobile ? 10 : 20,
  total: 0,
});
const categoryName = ref<string | undefined>(undefined);
const keyword = ref<string | undefined>(undefined);

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getProduct({
      name: keyword.value,
      description: keyword.value,
      "category.name": categoryName.value || keyword.value,
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
  } catch (error) {
    console.error(error);
    window.alert("เกิดข้อผิดพลาด");
  }
  loading.value = false;
};

const loadDataFromQuery = (query: LocationQuery) => {
  keyword.value = undefined;
  categoryName.value = undefined;

  if (query.keyword) {
    keyword.value = query.keyword as string;
  }
  if (query.category) {
    categoryName.value = query.category as string;
  }
  if (query.page) {
    pagination.page = parseInt(query.page as string);
  }
};

onActivated(() => {
  loadDataFromQuery(route.query);
  loadData();
});

onBeforeRouteUpdate((to, from, next) => {
  loadDataFromQuery(to.query);
  loadData();
  next();
});
</script>
<template>
  <Head>
    <title>
      {{ keyword ? `ค้นหา: ${keyword}` : `หมวดหมู่: ${categoryName}` }}
    </title>
  </Head>
  <UContainer class="flex flex-col gap-y-2 p-5">
    <span v-if="keyword" class="text-2xl"> ค้นหา: {{ keyword }} </span>
    <span v-if="categoryName" class="text-2xl">
      <UBadge color="white" variant="solid" size="lg">
        หมวดหมู่: {{ categoryName }}
      </UBadge>
    </span>

    <template v-if="!loading">
      <template v-if="products.length > 0">
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
