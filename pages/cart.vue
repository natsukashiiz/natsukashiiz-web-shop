<script setup lang="ts">
import type { CartResponse } from "~/types";
import { getAllCart, deleteCart, addCart, getCountCart } from "~/api/cart";
import { createOrder } from "~/api/order";

const cartStore = useCartStore();
const router = useRouter();
const toast = useToast();

const cart = ref<CartResponse[]>([]);
const selected = ref<CartResponse[]>([]);

const maxAmount = 150000;

const loadData = async () => {
  const res = await getAllCart();
  if (res.status === 200 && res.data) {
    cart.value = res.data;
    if (count.value === 1) selected.value = cart.value;
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const fetchCountCart = async () => {
  try {
    const res = await getCountCart();
    if (res.status === 200) {
      cartStore.setCount(res.data);
    }
  } catch (error) {
    console.error(error);
  }
};

const handleUpdateCart = async (
  productId: number,
  optionId: number,
  quantity: number
) => {
  try {
    const res = await addCart({
      productId,
      optionId,
      quantity,
    });

    if (res.status === 200 && res.data) {
      await fetchCountCart();
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
  selected.value = selected.value.filter((item) => item.id !== id);

  const res = await deleteCart(id);
  if (res.status === 200) {
    await loadData();
    await fetchCountCart();
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const totalPrice = computed(() => {
  return selected.value.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
});

const handleCreateOrder = async () => {
  // verify amount max
  if (totalPrice.value > maxAmount) {
    toast.clear();
    toast.add({
      title: "เกิดข้อผิดพลาด",
      description: `ยอดรวมต้องไม่เกิน ฿150,000`,
      timeout: 3000,
    });
    return;
  }

  try {
    const data = selected.value.map((item) => {
      return {
        productId: item.id,
        optionId: item.optionId,
        quantity: item.quantity,
      };
    });
    const res = await createOrder(data);
    if (res.status === 200) {
      router.push(`/payment/${res.data.orderId}`);
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error: any) {
    if (error.response.status) {
      if (error.response.data.error === "address.invalid") {
        router.push("/address");
      } else {
        window.alert(error.response.data.error);
      }
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  }
};

const count = computed(() => {
  return cart.value.filter((item) => item.maxQuantity > item.quantity).length;
});

const handleSelectAll = () => {
  if (selected.value.length === count.value) {
    selected.value = [];
  } else {
    selected.value = cart.value.filter(
      (item) => item.maxQuantity > item.quantity
    );
  }
};

const handleSelect = (item: CartResponse) => {
  const index = selected.value.findIndex((i) => i.id === item.id);
  if (index === -1) {
    selected.value.push(item);
  } else {
    selected.value = selected.value.filter((i) => i.id !== item.id);
  }
};

const isSelectedAll = computed(() => {
  return selected.value.length === count.value;
});

const isSelect = (item: CartResponse) => {
  return selected.value.findIndex((i) => i.id === item.id) !== -1;
};

onActivated(() => {
  selected.value = [];
  loadData();
});
</script>
<template>
  <UContainer class="max-w-3xl py-8">
    <UCard v-if="cart.length > 0">
      <template #header>
        <div class="flex justify-between">
          <div>จำนวนที่เลือก {{ selected.length }} รายการ</div>
          <div>
            <UButton
              color="primary"
              variant="outline"
              @click="handleSelectAll"
              v-if="!isSelectedAll"
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
        <template v-for="item in cart" :key="item.id">
          <a-cart-item
            :item="item"
            :selected="isSelect(item)"
            :max-quantity="item.maxQuantity"
            @selected="handleSelect(item)"
            @update="
              (quantity) =>
                handleUpdateCart(item.productId, item.optionId, quantity)
            "
            @remove="removeItem(item.id)"
          />
        </template>
      </ul>
      <div class="mt-6 border-t border-b py-2">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-400">ยอดรวม</p>
          <p class="text-lg font-semibold text-gray-900">
            ฿<ACurrency :amount="totalPrice" />
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
          <ACurrency :amount="totalPrice" /> บาท
        </p>
      </div>

      <div class="mt-6 text-center">
        <UButton
          block
          @click="handleCreateOrder"
          :disabled="selected.length === 0"
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
