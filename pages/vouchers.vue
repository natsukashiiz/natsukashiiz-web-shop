<script setup lang="ts">
import type { VoucherResponse } from "~/types";
import { DiscountType } from "~/types/enum";
import { queryVouchers, claimVoucher } from "~/api/voucher";

const toast = useToast();
const vouchers = ref<VoucherResponse[]>([]);

const loadData = async () => {
  try {
    const res = await queryVouchers();
    if (res.status === 200 && res.data) {
      vouchers.value = res.data;
    }
  } catch (error) {}
};

const handleClaimVoucher = async (voucherId: number) => {
  toast.clear();
  try {
    const res = await claimVoucher(voucherId);
    if (res.status === 200) {
      toast.add({
        title: "รับส่วนลดแล้ว",
        timeout: 3000,
      });
      loadData();
    }
  } catch (error) {
    const err = (error as any).response.data.error;
    if (err === "voucher.already.claimed") {
      toast.add({
        title: "คุณได้รับส่วนลดนี้ไปแล้ว",
        timeout: 3000,
      });
    } else {
      toast.add({
        title: "เกิดข้อผิดพลาด",
        timeout: 3000,
      });
    }
  }
};

onActivated(() => {
  loadData();
});
</script>

<template>
  <UContainer class="flex flex-col gap-y-2 p-5">
    <div
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 grid-rows-2 gap-3"
    >
      <template v-for="voucher in vouchers" :key="voucher.id">
        <UCard>
          <template #header>
            ส่วนลด {{ voucher.discount }}
            {{ voucher.discountType === DiscountType.PERCENTAGE ? "%" : "บาท" }}
          </template>

          <template #default>
            <li v-if="voucher.product" class="text-sm text-gray-500">
              สำหรับสินค้า {{ voucher.product.name }} เท่านั้น
            </li>
            <li v-if="voucher.category" class="text-sm text-gray-500">
              สำหรับสินค้าหมวดหมู่ {{ voucher.category.name }} เท่านั้น
            </li>
            <li v-if="voucher.minOrderPrice" class="text-sm text-gray-500">
              สำหรับการซื้อขั้นต่ำ {{ voucher.minOrderPrice }} บาท
            </li>
            <li class="text-sm text-gray-500">
              หมดอายุ {{ voucher.expiredAt }}
            </li>
          </template>

          <template #footer>
            <div class="flex justify-between items-center">
              <span>CODE: {{ voucher.code }}</span>
              <UButton
                :color="voucher.claimed ? 'gray' : 'blue'"
                @click="handleClaimVoucher(voucher.id)"
                :disabled="voucher.claimed"
              >
                รับส่วนลด
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </div>
  </UContainer>
</template>
