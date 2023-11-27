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
  ["SELF_CANCEL", "ยกเลิกโดยผู้ใช้"],
  ["SYSTEM_CANCEL", "ยกเลิกโดยระบบ"],
]);

const text = computed(() => statusMap.get(status));

const color = computed(() => {
  switch (status) {
    case OrderStatus.PENDING:
      return "gray-500";
    case OrderStatus.PAID:
      return "blue-500";
    case OrderStatus.SUCCESS:
      return "green-500";
    case OrderStatus.FAIL:
      return "red-500";
    case OrderStatus.SELF_CANCEL:
      return "orange-500";
    case OrderStatus.SYSTEM_CANCEL:
      return "yellow-500";
  }
});
</script>
<template>
  <span :class="`text-${color}`">{{ text }}</span>
</template>
