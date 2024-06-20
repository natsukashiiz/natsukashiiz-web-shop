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
  <UContainer class="flex flex-col gap-y-2 p-5">
    <div
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 grid-rows-2 gap-2"
    >
      <template v-for="voucher in vouchers" :key="voucher.id">
        <AVoucherCard :voucher="voucher" @refresh="loadData" />
      </template>
    </div>
  </UContainer>
</template>
