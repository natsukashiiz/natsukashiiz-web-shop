<script setup lang="ts">
import type { CartResponse, CartItemResponse, CartRequest } from "~/types";
import { getAllCart, deleteCart, updateCart } from "~/api/cart";
import { createOrder } from "~/api/order";

const cartStore = useCartStore();
const router = useRouter();
const toast = useToast();

const cart = ref<CartResponse>({
  items: [],
  countSelected: 0,
  totalQuantity: 0,
  totalSelectedQuantity: 0,
  totalPrice: 0,
});
const voucherId = ref<number | undefined>();

const maxAmount = 150000;

const loadData = async () => {
  const res = await getAllCart();
  if (res.status === 200 && res.data) {
    cart.value = res.data;
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const handleUpdateCart = async (data: CartRequest) => {
  try {
    const res = await updateCart(data);

    if (res.status === 200 && res.data) {
      cart.value = res.data;
      cartStore.setCount(cart.value.totalQuantity);
    } else {
      await loadData();
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error: any) {
    await loadData();
    if (error.response.status) {
      window.alert(error.response.data.error);
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  }
};

const removeItem = async (id: number) => {
  const res = await deleteCart(id);
  if (res.status === 200) {
    cart.value = res.data;
    cartStore.setCount(cart.value.totalQuantity);
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const handleCreateOrder = () => {};
const handleCreateOrderOld = async () => {
  // verify amount max
  if (300 > maxAmount) {
    toast.clear();
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: `ยอดรวมต้องไม่เกิน ฿150,000`,
      timeout: 3000,
    });
    return;
  }

  try {
    // const items = selected.value.map((item) => {
    //   return {
    //     productId: item.id,
    //     optionId: item.optionId,
    //     quantity: item.quantity,
    //   };
    // });
    const res = await createOrder({
      voucherId: voucherId.value,
      orderItems: [],
    });
    if (res.status === 200) {
      router.push(`/payment/${res.data.orderId}`);
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error: any) {
    if (error.response.status) {
      if (error.response.data.error === "address.invalid") {
        router.push("/profile/address");
      } else {
        window.alert(error.response.data.error);
      }
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  }
};

const count = computed(() => {
  return cart.value.items.filter((item) => item.maxQuantity > item.quantity)
    .length;
});

const handleSelectAll = () => {};

const handleSelect = async (item: CartItemResponse) => {
  await handleUpdateCart({
    productId: item.productId,
    optionId: item.optionId,
    quantity: item.quantity,
    selected: !item.selected,
  });
};

const isSelectedAll = computed(() => {});

const onLoad = () => {
  loadData();
};

onActivated(() => {
  onLoad();
});

onMounted(() => {
  onLoad();
});
</script>
<template>
  <UContainer class="max-w-3xl py-8">
    <UCard v-if="cart.items.length > 0">
      <template #header>
        <div class="flex justify-between">
          <div>จำนวนที่เลือก {{ cart.countSelected }} รายการ</div>
          <div>
            <UButton
              color="primary"
              variant="outline"
              @click="handleSelectAll"
              v-if="!false"
            >
              เลือกทั้งหมด
            </UButton>
            <UButton
              color="red"
              variant="outline"
              @click="handleSelectAll"
              v-else
            >
              ยกเลิก
            </UButton>
          </div>
        </div>
      </template>
      <ul class="-my-8">
        <template v-for="item in cart.items" :key="item.id">
          <a-cart-item
            :item="item"
            :max-quantity="item.maxQuantity"
            @selected="handleSelect(item)"
            @update="
              (quantity) =>
                handleUpdateCart({
                  productId: item.productId,
                  optionId: item.optionId,
                  quantity,
                  selected: item.selected,
                })
            "
            @remove="removeItem(item.id)"
          />
        </template>
      </ul>
      <div class="mt-6 border-t border-b py-2">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-400">ยอดรวม</p>
          <p class="text-lg font-semibold text-gray-900">
            ฿<ACurrency :amount="cart.totalPrice" />
          </p>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-400">ค่าขนส่ง</p>
          <p class="text-lg font-semibold text-gray-900">ฟรี</p>
        </div>
      </div>
      <div class="mt-6 flex items-center justify-between">
        <p class="text-sm font-medium text-gray-900">ยอดที่ต้องชำระ</p>
        <p class="text-2xl font-semibold text-gray-900">
          <ACurrency :amount="cart.totalPrice" /> บาท
        </p>
      </div>

      <div class="mt-6 text-center">
        <UButton
          block
          @click="handleCreateOrder"
          :disabled="cart.totalQuantity === 0"
        >
          ชำระเงิน
        </UButton>
      </div>
    </UCard>
    <UCard v-else>
      <div class="px-4 py-6 sm:px-8 sm:py-10">
        <div class="flex flex-col items-center justify-center">
          <p class="text-xl font-semibold text-gray-900">ไม่มีสินค้าในตะกร้า</p>
          <UButton to="/" color="white" variant="solid" class="mt-4">
            กลับไปหน้าแรก
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
