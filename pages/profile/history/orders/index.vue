<script setup lang="ts">
import type { OrderResponse } from "~/types";
import { getAllOrder } from "~/api/order";
import { OrderStatus } from "~/types/enum";

const loading = useLoading();

const orders = ref<OrderResponse[]>([]);

const items = [
  {
    label: "ทั้งหมด",
    value: "all",
  },
  {
    label: "รอดำเนินการ",
    value: OrderStatus.PENDING,
  },
  {
    label: "ชำระเงินแล้ว",
    value: OrderStatus.PAID,
  },
  {
    label: "สำเร็จ",
    value: OrderStatus.SUCCESSFUL,
  },
  {
    label: "ยกเลิกด้วยตนเอง",
    value: OrderStatus.SELF_CANCELED,
  },
  {
    label: "ยกเลิกโดยระบบ",
    value: OrderStatus.SYSTEM_CANCELED,
  },
  {
    label: "ล้มเหลว",
    value: OrderStatus.FAILED,
  },
];

const currentStatus = ref(items[0].value);
const onChange = async (index: number) => {
  const item = items[index];
  currentStatus.value = item.value;
  await loadData();
};

const loadData = async () => {
  loading.value = true;
  const res = await getAllOrder({
    status: currentStatus.value,
  });

  if (res.status === 200 && res.data) {
    orders.value = res.data;
  } else {
    window.alert("Error");
  }
  loading.value = false;
};

onActivated(() => {
  loadData();
});
</script>
<template>
  <Head>
    <title>ประวัติการสั่งซื้อ</title>
  </Head>
  <UContainer class="max-w-5xl py-8">
    <UTabs :items="items" @change="onChange" :default-index="0" />
    <UCard class="py-2" v-if="orders.length > 0">
      <ul class="-my-8">
        <template v-for="(item, index) in orders" :key="index">
          <a-order-card :item="item" />
          <UDivider v-if="index != orders.length - 1" />
        </template>
      </ul>
    </UCard>
    <UCard v-else>
      <div class="px-4 py-6 sm:px-8 sm:py-10">
        <div class="flex flex-col items-center justify-center">
          <p class="text-xl font-semibold text-gray-900">ไม่มีรายการสั่งซื้อ</p>
          <!-- <UButton to="/" color="white" variant="solid" class="mt-4">
            กลับไปหน้าแรก
          </UButton> -->
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
