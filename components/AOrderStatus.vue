<script setup lang="ts">
defineProps({
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
</script>
<template>
  <span>{{ statusMap.get(status) }}</span>
</template>
