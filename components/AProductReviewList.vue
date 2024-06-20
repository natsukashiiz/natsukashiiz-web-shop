<script setup lang="ts">
import { getProductReview } from "~/api/product";
import type { ProductResponse, ProductReviewResponse } from "~/types";

const authStore = useAuthStore();
const loading = useLoading();

const props = defineProps({
  product: {
    type: Object as PropType<ProductResponse>,
    required: true,
  },
});
const emit = defineEmits(["loadProduct"]);

const reviews = ref<ProductReviewResponse[]>([]);
const pagination = reactive({
  page: 1,
  limit: 5,
  total: 0,
});

const loadReview = async () => {
  loading.value = true;
  try {
    const res = await getProductReview(props.product.id, {
      page: pagination.page,
      size: pagination.limit,
      sort: "createdAt,desc",
    });

    if (res.status === 200 && res.data) {
      reviews.value = res.data.list;
      pagination.total = res.data.total;
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error) {
    window.alert("เกิดข้อผิดพลาด");
  }
  loading.value = false;
};

const changePage = async () => {
  await loadReview();
};

const isLastReview = (idx: number) => {
  return (
    pagination.page * pagination.limit - 1 !== idx &&
    idx !== reviews.value.length - 1
  );
};

const reloadReview = async () => {
  await loadReview();
  emit("loadProduct");
};

onMounted(() => {
  loadReview();
});

onActivated(() => {
  loadReview();
});
</script>
<template>
  <UCard class="w-full">
    <template #header>
      <span class="text-lg font-semibold text-gray-900">รีวิวสินค้า</span>
    </template>
    <div class="text-center">
      <p>คะแนนของสินค้า</p>
      <ARatingCount
        :rating="product.rating"
        :reviews="product.reviews"
        class="flex justify-center my-4"
      />
    </div>
    <template v-if="authStore.isAuth">
      <UDivider label="เขียนรีวิว" color="gray" class="my-3" />
      <AProductReviewForm
        :product-id="product.id"
        @load-review="reloadReview"
      />
    </template>
    <UDivider label="รีวิวล่าสุด" color="gray" class="my-3" />
    <template v-if="pagination.total > 0">
      <template v-for="(review, idx) in reviews" :key="review.id">
        <ARatingComment
          class="py-4"
          :account="{
            name: review.profile.email,
          }"
          :date="review.createdAt"
          :rating="review.rating"
          :content="review.content"
        />
        <UDivider v-if="isLastReview(idx)" />
      </template>
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
    <template v-else>
      <div class="flex justify-center items-center h-32">
        <span class="text-gray-500">ไม่มีรีวิวสินค้า</span>
      </div>
    </template>
  </UCard>
</template>
