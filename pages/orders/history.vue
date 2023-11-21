<script setup lang="ts">
import type { OrderResponse } from "~/types";
import { getAllOrder } from "~/api/order";

const orders = ref<OrderResponse[]>([]);

const loadData = async () => {
  const res = await getAllOrder();

  if (res.status === 200 && res.data) {
    orders.value = res.data;
  } else {
    window.alert("Error");
  }
};

onMounted(async () => {
  await loadData();
});
</script>
<template>
  <section class="min-h-screen bg-gray-100 py-2">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mt-8 max-w-2xl md:mt-12">
        <div class="bg-white shadow">
          <div class="px-4 py-6 sm:px-8 sm:py-10" v-if="orders.length > 0">
            <div class="flow-root">
              <ul class="-my-8">
                <template v-for="item in orders" :key="item.id">
                  <a-order-card :item="item" />
                  <hr />
                </template>
              </ul>
            </div>
          </div>
          <div class="px-4 py-6 sm:px-8 sm:py-10" v-else>
            <div class="flex flex-col items-center justify-center">
              <p class="text-2xl font-semibold text-gray-900">
                ไม่มีรายการสั่งซื้อ
              </p>
              <router-link
                to="/"
                class="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
              >
                กลับไปหน้าแรก
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
