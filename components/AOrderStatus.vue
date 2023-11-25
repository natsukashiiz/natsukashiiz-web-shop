<script setup lang="ts">
import { OrderStatus } from "~/types/enum";

defineProps({
  status: {
    type: String,
    required: false,
    default: OrderStatus.PENDING,
  },
});

const statusMap = new Map([
  ["PENDING", "รอดำเนินการ"],
  ["PAID", "ชำระเงินแล้ว"],
  ["SUCCESS", "สำเร็จ"],
  ["FAIL", "ล้มเหลว"],
  ["SELF_CANCEL", "ยกเลิกโดยผู้ใช้"],
  ["SYSTEM_CANCEL", "ยกเลิกโดยระบบ"],
]);
</script>
<template>
  <span>{{ statusMap.get(status) }}</span>
</template>
