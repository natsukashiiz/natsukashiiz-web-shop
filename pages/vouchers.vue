<script setup lang="ts">
import type { VoucherResponse } from "~/types";
import { queryVouchers } from "~/api/voucher";

const vouchers = ref<VoucherResponse[]>([]);

const loadData = async () => {
  try {
    const res = await queryVouchers();
    if (res.status === 200 && res.data) {
      vouchers.value = res.data;
    }
  } catch (error) {}
};

onActivated(() => {
  loadData();
});
</script>

<template>
  <Head>
    <title>ส่วนลด</title>
  </Head>
  <UContainer class="flex flex-col gap-y-2 px-5 pt-4 pb-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-2">
      <template v-for="voucher in vouchers" :key="voucher.id">
        <AVoucherCard :voucher="voucher" @refresh="loadData" />
      </template>
    </div>
  </UContainer>
</template>
