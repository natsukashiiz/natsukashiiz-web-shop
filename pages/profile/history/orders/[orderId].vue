<script setup lang="ts">
import type { OrderResponse } from "~/types";
import { cancelOrder, getOneOrder } from "~/api/order";
import { OrderStatus } from "~/types/enum";

const route = useRoute();

const order = ref<OrderResponse>();

const loadData = async () => {
  const res = await getOneOrder((route.params as any).orderId as string);

  if (res.status === 200 && res.data) {
    order.value = res.data;
  } else {
    window.alert("Error");
  }
};

onActivated(() => {
  loadData();
});
</script>

<template>
  <main
    class="mx-auto max-w-2xl pb-24 pt-8 sm:px-6 sm:pt-16 lg:max-w-7xl lg:px-8"
    v-if="order"
  >
    <Head>
      <title>ออเดอร์ #{{ order.orderId }}</title>
    </Head>
    <div
      class="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0"
    >
      <div class="flex sm:items-baseline sm:space-x-4">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          ออเดอร์ #{{ order.orderId }}
        </h1>
      </div>
      <p class="text-sm text-gray-600">วันที่สั่งซื้อ {{ order.createdAt }}</p>
    </div>

    <!-- Products -->
    <section aria-labelledby="products-heading" class="mt-6">
      <div class="space-y-8">
        <div
          class="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border relative"
        >
          <div class="absolute top-3 md:top-9 right-5">
            <h4 class="sr-only">สถานะ</h4>
            <p class="text-sm font-medium text-gray-900">
              สถานะ: <a-order-status :status="order.status" />
            </p>
          </div>

          <div
            class="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8 mt-4 md:mt-0"
          >
            <div
              class="sm:flex lg:col-span-7 my-1"
              v-for="item in order.items"
              :key="item.optionId"
            >
              <div
                class="aspect-h-1 aspect-w-1 w-full flex-shrink-0 overflow-hidden rounded-lg sm:aspect-none sm:h-40 sm:w-40"
              >
                <img
                  class="h-full w-full object-cover object-center sm:h-full sm:w-full"
                  :src="item.productThumbnail"
                  :alt="item.productName"
                />
              </div>

              <div class="mt-6 sm:ml-6 sm:mt-0">
                <h3 class="text-base font-medium text-gray-900 line-clamp-1">
                  {{ item.productName }}
                </h3>
                <p class="mt-2 text-sm font-medium text-gray-900">
                  ราคา : ฿<a-currency :amount="item.price" />
                </p>
                <p class="mt-2 text-sm font-medium text-gray-900">
                  จำนวน : {{ item.quantity }} ชิ้น
                </p>
                <p class="mt-2 text-sm font-medium text-gray-900">
                  ราคารวม : ฿<a-currency :amount="item.price * item.quantity" />
                </p>
              </div>
            </div>
          </div>
          <div
            class="border-t border-gray-200 px-4 py-6 sm:px-6 lg:p-8 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0"
          >
            <div>
              <dt class="font-medium text-gray-900">ที่อยู่ในการจัดส่ง</dt>
              <dd class="mt-3 text-gray-500">
                <span class="block"
                  >ชื่อ : {{ order?.firstName }} {{ order.lastName }}</span
                >
                <span class="block">เบอร์โทร : {{ order.mobile }}</span>
                <span class="block">ที่อยู่ : {{ order.address }}</span>
              </dd>
            </div>
            <div class="flex flex-col">
              <template v-if="order.status === OrderStatus.PENDING">
                <span class="font-medium text-gray-900">
                  ยอดที่ต้องชำระ : <a-currency :amount="order.totalPay" /> บาท
                </span>
                <UButton
                  :to="`/payment/${order.orderId}`"
                  color="green"
                  block
                  class="mt-2"
                >
                  ชำระเงิน
                </UButton>
                <UButton
                  :to="`/payment/${order.orderId}`"
                  color="gray"
                  block
                  class="mt-2"
                >
                  ยกเลิกออเดอร์
                </UButton>
              </template>
              <template v-if="order.status === OrderStatus.PAID">
                <span class="font-medium text-gray-900"
                  >ยอดที่ชำระ : <a-currency :amount="order.totalPay" /> บาท
                </span>
                <span class="font-medium text-gray-900" v-if="order.paidAt">
                  เวลาที่ชำระ : {{ order.paidAt }}
                </span>
                <span class="font-medium text-gray-900" v-if="order.payMethod">
                  วิธีการชำระ : {{ order.payMethod }}
                </span>
              </template>
              <template v-if="order.status === OrderStatus.SELF_CANCELED">
                <span class="font-medium text-gray-900" v-if="order.cancelAt">
                  เวลาที่ยกเลิก : {{ order.cancelAt }}
                </span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
