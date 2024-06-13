<script setup lang="ts">
import { getProduct } from "~/api/product";
import type { ProductResponse } from "~/types";

const router = useRouter();
const loading = useLoading();
const isOpen = ref(false);
const keyword = ref("");
const results = ref<ProductResponse[]>([]);
const total = ref(0);

watch(isOpen, (value) => {
  results.value = [];
});

const lock = ref(false);
watch(keyword, () => {
  if (!keyword.value) {
    results.value = [];
    return;
  }

  // Prevent multiple requests
  if (lock.value) {
    return;
  }

  // Lock the request
  lock.value = true;

  // Delay 700ms before sending a request
  setTimeout(() => {
    loadData();
    lock.value = false;
  }, 500);
});

const loadData = async () => {
  if (!keyword.value) {
    return;
  }

  try {
    const res = await getProduct({
      name: keyword.value,
      description: keyword.value,
      "category.name": keyword.value,
      page: 1,
      size: 10,
    });

    if (res.status === 200 && res.data) {
      results.value = res.data.list;
      total.value = res.data.total;
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error) {
    console.error(error);
    window.alert("เกิดข้อผิดพลาด");
  }
};

const handleClear = () => {
  keyword.value = "";
  results.value = [];
};

const handleSelect = (product: ProductResponse) => {
  isOpen.value = false;
  keyword.value = "";
  results.value = [];
  router.push({ name: "products-id", params: { id: product.id } });
};
</script>
<template>
  <UModal v-model="isOpen">
    <div class="p-4">
      <UInput
        v-model="keyword"
        name="keyword"
        placeholder="ค้นหาสินค้าที่คุณต้องการ..."
        icon="i-heroicons-magnifying-glass-20-solid"
        autocomplete="off"
        :ui="{ icon: { trailing: { pointer: '' } } }"
        class="w-full"
        variant="none"
      >
        <template #trailing>
          <UButton
            v-show="keyword"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            :padded="false"
            @click="handleClear"
          />
        </template>
      </UInput>
      <UDivider class="my-4" />
      <ULoading v-model="loading">
        <template #default>
          <div v-if="results.length === 0" class="text-center text-gray-500">
            ไม่พบสินค้าที่คุณค้นหา
          </div>
          <div v-else>
            <!-- with tailwind css -->
            <div class="grid grid-cols-1 gap-2">
              <template v-for="product in results">
                <div
                  class="cursor-pointer hover:bg-gray-100 px-2 rounded-lg"
                  @click="handleSelect(product)"
                >
                  <div class="text-sm text-gray-500 mt-2">
                    {{ product.name }}
                  </div>
                </div>
              </template>
            </div>
            <div v-if="total > 10" class="text-center mt-4">
              <ULink
                :to="{ name: 'products-search', query: { name: keyword } }"
                @click="isOpen = false"
                class="text-blue-500"
              >
                ดูสินค้าทั้งหมด
              </ULink>
            </div>
          </div>
        </template>
      </ULoading>
    </div>
  </UModal>
  <UTooltip text="ค้นหาสินค้า" placement="bottom">
    <UButton
      icon="i-heroicons-magnifying-glass-20-solid"
      color="gray"
      @click="isOpen = true"
    />
  </UTooltip>
</template>
