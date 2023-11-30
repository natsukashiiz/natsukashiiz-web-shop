<script setup lang="ts">
import type { OrderResponse } from "~/types";
import { getAllOrder } from "~/api/order";

const orders = ref<OrderResponse[]>([]);

const items = [
  {
    label: "ทั้งหมด",
    value: "all",
  },
  {
    label: "รอดำเนินการ",
    value: "pending",
  },
  {
    label: "ชำระเงินแล้ว",
    value: "paid",
  },
  {
    label: "สำเร็จ",
    value: "successful",
  },
  {
    label: "ยกเลิกด้วยตนเอง",
    value: "self_canceled",
  },
  {
    label: "ยกเลิกโดยระบบ",
    value: "system_canceled",
  },
  {
    label: "ล้มเหลว",
    value: "failed",
  },
];

const currentStatus = ref(items[0].value);
const onChange = async (index: number) => {
  const item = items[index];
  currentStatus.value = item.value;
  await loadData();
};

const loadData = async () => {
  const res = await getAllOrder({
    status: currentStatus.value,
  });

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
  <section class="py-2">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mt-8 max-w-4xl md:mt-12">
        <UTabs :items="items" @change="onChange" :default-index="0" />
        <div class="bg-white shadow">
          <div class="px-4 py-6 sm:px-8 sm:py-10" v-if="orders.length > 0">
            <div class="flow-root">
              <ul class="-my-8">
                <template v-for="(item, index) in orders" :key="item.id">
                  <a-order-card :item="item" />
                  <UDivider v-if="index != orders.length - 1" />
                </template>
              </ul>
            </div>
          </div>
          <div class="px-4 py-6 sm:px-8 sm:py-10" v-else>
            <div class="flex flex-col items-center justify-center">
              <p class="text-2xl font-semibold text-gray-900">
                ไม่มีรายการสั่งซื้อ
              </p>
              <UButton to="/" color="white" variant="solid" class="mt-4">
                กลับไปหน้าแรก
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
