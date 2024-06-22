<script setup lang="ts">
import { DiscountType } from "~/types/enum";
import { claimVoucher } from "~/api/voucher";
import type { VoucherResponse } from "~/types";

const props = defineProps({
  voucher: {
    type: Object as () => VoucherResponse,
    required: true,
  },
});
const emit = defineEmits(["refresh"]);

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const loading = ref(false);
const data = ref<VoucherResponse>(props.voucher);

const handleClaimVoucher = async (voucherId: number) => {
  if (!authStore.authenticated) {
    router.push({
      name: "login",
      query: { redirect: router.currentRoute.value.fullPath },
    });
    return;
  }

  toast.clear();
  loading.value = true;
  try {
    const res = await claimVoucher(voucherId);
    if (res.status === 200) {
      toast.add({
        title: "รับส่วนลดแล้ว",
        timeout: 3000,
      });
      data.value.claimed = true;
      emit("refresh");
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
  loading.value = false;
};
</script>

<template>
  <UCard>
    <template #header>
      ส่วนลด {{ voucher.discount }}
      {{ voucher.discountType === DiscountType.PERCENT ? "%" : "บาท" }}
    </template>

    <template #default>
      <li v-if="voucher.product" class="text-sm text-gray-500">
        สำหรับสินค้า
        <ULink
          :to="{
            name: 'products-id',
            params: { id: voucher.product.id },
          }"
          class="text-blue-500"
        >
          {{ voucher.product.name }}
        </ULink>
      </li>
      <li v-if="voucher.category" class="text-sm text-gray-500">
        สำหรับหมวดหมู่
        <ULink
          :to="{
            name: 'products-search',
            query: { category: voucher.category.name },
          }"
          class="text-blue-500"
        >
          {{ voucher.category.name }}
        </ULink>
      </li>
      <li v-if="voucher.minOrderPrice" class="text-sm text-gray-500">
        สำหรับการซื้อขั้นต่ำ
        <ACurrency :amount="voucher.minOrderPrice" /> บาท
      </li>
      <li class="text-sm text-gray-500">หมดอายุ {{ voucher.expiredAt }}</li>
    </template>

    <template #footer>
      <div class="flex justify-between items-center">
        <span>CODE: {{ voucher.code }}</span>
        <UButton
          :color="data.claimed ? 'gray' : 'primary'"
          @click="handleClaimVoucher(voucher.id)"
          :disabled="data.claimed"
          :loading="loading"
        >
          {{ data.claimed ? "รับส่วนลดแล้ว" : "รับส่วนลด" }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>
