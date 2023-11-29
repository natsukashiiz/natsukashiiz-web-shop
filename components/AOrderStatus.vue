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
  ["SUCCESSFUL", "สำเร็จ"],
  ["FAILED", "ล้มเหลว"],
  ["SELF_CANCELED", "ยกเลิกด้วยตนเอง"],
  ["SYSTEM_CANCELED", "ยกเลิกโดยระบบ"],
]);

const statusColorMap = new Map([
  ["PENDING", "gray-500"],
  ["PAID", "blue-500"],
  ["SUCCESSFUL", "green-500"],
  ["FAILED", "red-500"],
  ["SELF_CANCELED", "orange-500"],
  ["SYSTEM_CANCELED", "yellow-500"],
]);
</script>
<template>
  <span :class="`text-${statusColorMap.get(status)}`">{{
    statusMap.get(status)
  }}</span>
</template>
