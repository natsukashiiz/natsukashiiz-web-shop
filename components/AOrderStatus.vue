<script setup lang="ts">
import { OrderStatus } from "~/types/enum";

const { status } = defineProps({
  status: {
    type: String,
    required: true,
  },
});

const statusMap = new Map([
  ["PENDING", "รอดำเนินการ"],
  ["PAID", "ชำระเงินแล้ว"],
  ["SUCCESS", "สำเร็จ"],
  ["FAIL", "ล้มเหลว"],
  ["SELF_CANCEL", "ยกเลิกด้วยตนเอง"],
  ["SYSTEM_CANCEL", "ยกเลิกโดยระบบ"],
]);

const statusColorMap = new Map([
  ["PENDING", "gray-500"],
  ["PAID", "blue-500"],
  ["SUCCESS", "green-500"],
  ["FAIL", "red-500"],
  ["SELF_CANCEL", "orange-500"],
  ["SYSTEM_CANCEL", "yellow-500"],
]);
</script>
<template>
  <span :class="`text-${statusColorMap.get(status)}`">{{
    statusMap.get(status)
  }}</span>
</template>
