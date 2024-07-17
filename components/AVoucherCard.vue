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
        title: "เก็บส่วนลดแล้ว",
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
  <div class="flex felx-1 border border-1 rounded-md">
    <NuxtImg
      :src="voucher.thumbnail"
      :alt="voucher.thumbnail"
      class="aspect-square rounded-l-md w-[78px] h-[78px] md:w-[156px] md:h-[156px]"
    />
    <div class="flex flex-col flex-1 px-2 md:px-4 justify-center">
      <div
        class="flex items-center space-x-1 text-sm font-thin md:text-xl md:font-light"
      >
        <span>ส่วนลด</span>
        <span v-if="voucher.discountType === DiscountType.PERCENT">
          {{ voucher.discount }}%
        </span>
        <span v-else> <ACurrency :amount="data.discount" /> บาท </span>
      </div>
      <span
        v-if="voucher.discountType === DiscountType.PERCENT"
        class="text-xs md:text-sm text-gray-500"
      >
        สูงสุด {{ voucher.maxDiscount }} บาท
      </span>
      <span
        v-if="voucher.minOrderPrice"
        class="text-xs md:text-sm text-gray-500"
      >
        ขั้นต่ำ
        <ACurrency :amount="voucher.minOrderPrice" /> บาท
      </span>
      <span class="hidden md:block text-xs md:text-sm text-gray-500">
        ถึง {{ voucher.expiredAt }}
      </span>
      <span
        v-if="voucher.product"
        class="hidden md:block text-xs md:text-sm text-gray-500"
      >
        เฉพาะสินค้า
        <ULink
          :to="{
            name: 'products-id',
            params: { id: voucher.product.id },
          }"
          class="text-blue-500"
        >
          {{ voucher.product.name }}
        </ULink>
      </span>
      <span
        v-if="voucher.category"
        class="hidden md:block text-xs md:text-sm text-gray-500"
      >
        เฉพาะหมวดหมู่
        <ULink
          :to="{
            name: 'products-search',
            query: { category: voucher.category.name },
          }"
          class="text-blue-500"
        >
          {{ voucher.category.name }}
        </ULink>
      </span>
      <UPopover class="block md:hidden">
        <a
          slot="trigger"
          class="text-xs text-blue-600 cursor-pointer"
          @click="() => {}"
        >
          รายละเอียดเพิ่มเติม
        </a>

        <template #panel>
          <div class="flex flex-col p-2">
            <span class="text-xs text-gray-500">
              ถึง {{ voucher.expiredAt }}
            </span>
            <span v-if="voucher.product" class="text-xs text-gray-500">
              เฉพาะสินค้า
              <ULink
                :to="{
                  name: 'products-id',
                  params: { id: voucher.product.id },
                }"
                class="text-blue-500"
              >
                {{ voucher.product.name }}
              </ULink>
            </span>
            <span v-if="voucher.category" class="text-xs text-gray-500">
              เฉพาะหมวดหมู่
              <ULink
                :to="{
                  name: 'products-search',
                  query: { category: voucher.category.name },
                }"
                class="text-blue-500"
              >
                {{ voucher.category.name }}
              </ULink>
            </span>
          </div>
        </template>
      </UPopover>
    </div>
    <div class="flex flex-col items-center justify-center">
      <UButton
        :color="data.claimed || data.quantity === 0 ? 'gray' : 'primary'"
        @click="handleClaimVoucher(voucher.id)"
        :disabled="data.claimed || data.quantity === 0"
        :loading="loading"
        class="self-end mr-2 md:mr-4"
      >
        <span v-if="data.claimed">เก็บแล้ว</span>
        <span v-else-if="data.quantity === 0">หมด</span>
        <span v-else>เก็บ</span>
      </UButton>
    </div>
  </div>
</template>
