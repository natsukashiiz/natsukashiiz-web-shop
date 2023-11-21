<script setup lang="ts">
import type { OrderResponse } from "~/types";
import { getOneOrder } from "~/api/order";

const route = useRoute();

const order = ref<OrderResponse>();

const loadData = async () => {
  const res = await getOneOrder(route.params.orderId as string);

  if (res.status === 200 && res.data) {
    order.value = res.data;
  } else {
    window.alert("Error");
  }
};

onMounted(async () => {
  await loadData();
});
</script>

<template>
  <main
    class="mx-auto max-w-2xl pb-24 pt-8 sm:px-6 sm:pt-16 lg:max-w-7xl lg:px-8"
  >
    <div
      class="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0"
    >
      <div class="flex sm:items-baseline sm:space-x-4">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          ออเดอร์ #{{ order?.orderId }}
        </h1>
      </div>
      <p class="text-sm text-gray-600">วันที่สั่งซื้อ {{ order?.time }}</p>
    </div>

    <!-- Products -->
    <section aria-labelledby="products-heading" class="mt-6">
      <div class="space-y-8">
        <div
          class="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border relative"
        >
          <div class="absolute top-6 right-5">
            <h4 class="sr-only">สถานะ</h4>
            <p class="text-sm font-medium text-gray-900">
              สถานะ: {{ order?.status }}
            </p>
          </div>

          <div
            class="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8"
          >
            <div
              class="sm:flex lg:col-span-7 my-1"
              v-for="item in order?.items"
              :key="item.optionId"
            >
              <div
                class="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40"
              >
                <img
                  src="https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-01.jpg"
                  alt="Insulated bottle with white base and black snap lid."
                  class="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
              </div>

              <div class="mt-6 sm:ml-6 sm:mt-0">
                <h3 class="text-base font-medium text-gray-900">
                  <a href="#">{{ item.productName }}</a>
                </h3>
                <p class="mt-2 text-sm font-medium text-gray-900">
                  ราคา ฿{{ item.price }}
                </p>
                <p class="mt-2 text-sm font-medium text-gray-900">
                  จำนวน {{ item.quantity }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8 flex justify-between"
          >
            <div>
              <dt class="font-medium text-gray-900">ที่อยู่ในการจัดส่ง</dt>
              <dd class="mt-3 text-gray-500">
                <span class="block"
                  >ชื่อ {{ order?.address.firstName }}
                  {{ order?.address.lastName }}</span
                >
                <span class="block">เบอร์โทร {{ order?.address.mobile }}</span>
                <span class="block">ที่อยู่ {{ order?.address.address }}</span>
              </dd>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
