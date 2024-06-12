<script setup lang="ts">
definePageMeta({
  key: (route) => route.fullPath,
  keepalive: true,
});

import type {
  ProductResponse,
  CarouselResponse,
  CategoryResponse,
} from "~/types";
import { getPageProduct } from "~/api/product";
import { getAllCarousel } from "~/api/carousel";
import { getAllCategory } from "~/api/category";

const loading = useLoading();
const route = useRoute();
const router = useRouter();

const products = ref<ProductResponse[]>([]);
const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
});
const carousels = ref<CarouselResponse[]>([]);
const carouselRef = ref();
const categories = ref<CategoryResponse[]>([]);

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

const loadCarousel = async () => {
  const res = await getAllCarousel();
  if (res.status === 200 && res.data) {
    carousels.value = res.data;
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const loadCategory = async () => {
  const res = await getAllCategory();
  if (res.status === 200 && res.data) {
    categories.value = res.data;
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const changePage = async () => {
  const currentPage = route.query.page ? Number(route.query.page) : 1;
  if (currentPage !== pagination.page) {
    await router.push({
      query: { page: pagination.page },
    });
    await loadData();
  }
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

  Promise.all([loadData(), loadCarousel(), loadCategory()]);
  //   scroll();

  setInterval(() => {
    if (!carouselRef.value) return;

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0);
    }

    carouselRef.value.next();
  }, 5000);
});
</script>
<template>
  <UContainer class="flex flex-col gap-y-2 p-5">
    <div class="max-w-3xl mx-auto mb-5">
      <!-- carousel -->
      <UCarousel
        ref="carouselRef"
        v-slot="{ item }"
        :items="carousels"
        :ui="{ item: 'basis-full' }"
        class="rounded-lg overflow-hidden"
        arrows
      >
        <img :src="item.imageUrl" class="w-full" draggable="false" />
      </UCarousel>
    </div>
    <!-- category -->
    <div class="max-w-3xl mx-auto mb-5">
      <UDivider label="หมวดหมู่" class="pb-4" />

      <div class="flex flex-wrap gap-2">
        <template v-for="item in categories" :key="item.id">
          <UButton
            :label="item.name"
            :to="{
              name: 'products-search',
              query: {
                categoryName: item.name,
              },
            }"
            variant="outline"
            color="gray"
            class="rounded-full"
            size="sm"
          >
            <template #leading> <UAvatar :src="item.thumbnail" /> </template
          ></UButton>
        </template>
      </div>
    </div>
    <UDivider label="สินค้าแนะนำ" class="mb-4" />
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
        @click="changePage"
        :active-button="{ variant: 'outline' }"
        :inactive-button="{ color: 'gray' }"
      />
    </div>
  </UContainer>
</template>
