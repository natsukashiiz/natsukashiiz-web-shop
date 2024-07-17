<script setup lang="ts">
import type { CheckoutResponse, VoucherResponse } from "~/types";
import { checkout, createOrder } from "~/api/order";
import { DiscountType } from "~/types/enum";

const toast = useToast();
const router = useRouter();

const order = ref<CheckoutResponse>({
  address: {
    id: 0,
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    main: false,
  },
  items: [],
  vouchers: [],
  totalQuantity: 0,
  totalPay: 0,
  totalDiscount: 0,
  totalShipping: 0,
  actualPay: 0,
});

type VoucherOption = {
  name: string;
  value: number;
};

const voucherOptions = ref<VoucherOption[]>([
  { name: "ไม่มีส่วนลด", value: 0 },
]);
const voucherId = ref<number>(0);
const voucherIdValue = computed(() =>
  voucherId.value == 0 ? undefined : voucherId.value
);

const dataLoaded = ref(false);
const loadData = async () => {
  dataLoaded.value = true;
  try {
    const response = await checkout({
      voucherId: voucherIdValue.value,
    });
    order.value = response.data;

    voucherOptions.value = [{ name: "ไม่มีส่วนลด", value: 0 }];
    voucherOptions.value.push(
      ...response.data.vouchers.map((voucher: VoucherResponse) => {
        return {
          name:
            voucher.discountType === DiscountType.PERCENT
              ? `ลด ${voucher.discount}% สูงสุด ${voucher.maxDiscount} บาท`
              : `ลด ${voucher.discount} บาท`,
          value: voucher.id,
        };
      })
    );
  } catch (error: any) {
    if (error.response.status === 417) {
      const err = error.response.data.error;
      if (err === "cart.selected.empty") {
        router.replace({ name: "cart" });
      } else if (err === "address.invalid") {
        router.push({
          name: "profile-address",
          query: { redirect: "/orders/checkout" },
        });
      } else if (err === "product.quantity.insufficient") {
        toast.add({
          title: "สินค้าไม่เพียงพอ",
          description: "สินค้าบางรายการมีจำนวนไม่เพียงพอ",
          timeout: 5000,
        });
        router.replace({ name: "cart" });
      } else {
        toast.add({
          title: "เกิดข้อผิดพลาด",
          description: "กรุณาลองใหม่อีกครั้ง",
          timeout: 5000,
        });
        router.replace({ name: "cart" });
      }
    }
  }
};

const handleCreateOrder = async () => {
  try {
    const items = order.value.items.map((item) => {
      return {
        productId: item.product.id,
        optionId: item.option.id,
        quantity: item.quantity,
        selected: true,
      };
    });
    const res = await createOrder({
      voucherId: voucherIdValue.value,
      orderItems: items,
    });
    if (res.status === 200) {
      router.replace({
        name: "payment-orderId",
        params: { orderId: res.data.orderId },
      });
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error: any) {
    if (error.response.status) {
      if (error.response.data.error === "address.invalid") {
        router.push({
          name: "profile-address",
          query: { redirect: "/orders/checkout" },
        });
      } else {
        window.alert(error.response.data.error);
      }
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  }
};

watch(voucherId, () => {
  loadData();
});

await loadData();

onActivated(() => {
  if (!dataLoaded.value) {
    loadData();
  }
});

onDeactivated(() => {
  dataLoaded.value = false;
});
</script>

<template>
  <Head>
    <title>สรุปรายการสั่งซื้อ</title>
  </Head>
  <UContainer class="max-w-4xl my-4">
    <div class="flex flex-col space-y-4">
      <h1 class="text-lg sm:text-2xl font-semibold">สรุปรายการสั่งซื้อ</h1>
      <UCard>
        <ULink
          :to="{ name: 'profile-address' }"
          class="flex flex-col cursor-pointer hover:bg-gray-100/50"
        >
          <span>ที่อยู่สำหรับจัดส่ง</span>
          <div>
            {{ order.address.firstName + " " + order.address.lastName }} |
            {{ order.address.mobile }}
          </div>
          <div>{{ order.address.address }}</div>
        </ULink>
      </UCard>
      <UCard>
        <div class="flex flex-col gap-2">
          <div v-for="(item, idx) in order.items" :key="idx">
            <div class="flex flex-row space-x-4">
              <AProductImage
                :src="item.product.thumbnail"
                class="w-28 h-28 rounded-lg"
              />
              <div class="flex flex-col space-y-1 w-full">
                <span class="text-ellipsis">{{ item.product.name }}</span>
                <span>ตัวเลือก {{ item.option.name }}</span>
                <div class="flex flex-row justify-between">
                  <span><ACurrency :amount="item.option.price" /></span>
                  <span>x{{ item.quantity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <div class="flex flex-row justify-between">
            <span>คำสั่งซื้อทั้งหมด (x{{ order.totalQuantity }})</span>
            <span><ACurrency :amount="order.totalPay" /> บาท</span>
          </div>
        </template>
      </UCard>
      <UCard>
        <div class="flex flex-row justify-between items-center">
          <span>ส่วนลด</span>
          <div v-if="order.vouchers.length > 0">
            <USelect
              v-model="voucherId"
              :options="voucherOptions"
              option-attribute="name"
            />
          </div>
          <span v-else>ไม่มีส่วนลด</span>
        </div>
      </UCard>
      <UCard>
        <div class="flex flex-row justify-between">
          <span>ส่วนลด</span>
          <span><ACurrency :amount="order.totalDiscount" /> บาท</span>
        </div>
        <div class="flex flex-row justify-between">
          <span>ค่าจัดส่ง</span>
          <span><ACurrency :amount="order.totalShipping" /> บาท</span>
        </div>
        <div class="flex flex-row justify-between">
          <span>ยอดที่ต้องชำระ</span>
          <span><ACurrency :amount="order.actualPay" /> บาท</span>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <UButton
              label="สั่งซื้อ"
              variant="solid"
              @click="handleCreateOrder"
              block
            />
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
