<script setup lang="ts">
import { OrderStatus } from "~/types/enum";

defineProps({
  status: {
    type: Object as () => OrderStatus,
    required: true,
  },
});

const statusMap = new Map([
  [OrderStatus.PENDING, "รอดำเนินการ"],
  [OrderStatus.PAID, "ชำระเงินแล้ว"],
  [OrderStatus.SHIPPING, "กำลังจัดส่ง"],
  [OrderStatus.SUCCESSFUL, "สำเร็จ"],
  [OrderStatus.FAILED, "ล้มเหลว"],
  [OrderStatus.SELF_CANCELED, "ยกเลิกด้วยตนเอง"],
  [OrderStatus.SELLER_CANCELED, "ยกเลิกโดยผู้ขาย"],
  [OrderStatus.SYSTEM_CANCELED, "ยกเลิกโดยระบบ"],
]);

const statusColorMap = new Map([
  [OrderStatus.PENDING, "gray-500"],
  [OrderStatus.PAID, "blue-500"],
  [OrderStatus.SHIPPING, "purple-500"],
  [OrderStatus.SUCCESSFUL, "green-500"],
  [OrderStatus.FAILED, "red-500"],
  [OrderStatus.SELF_CANCELED, "orange-500"],
  [OrderStatus.SELLER_CANCELED, "red-500"],
  [OrderStatus.SYSTEM_CANCELED, "yellow-500"],
]);
</script>
<template>
  <span :class="`text-${statusColorMap.get(status)}`">
    {{ statusMap.get(status) }}
  </span>
</template>
