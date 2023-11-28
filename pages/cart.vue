<script setup lang="ts">
import type { CartResponse } from "~/types";
import { getAllCart, deleteCart, addCart } from "~/api/cart";
import { createOrder } from "~/api/order";

const cart = ref<CartResponse[]>([]);
const selected = ref<CartResponse[]>([]);

const loadData = async () => {
  const res = await getAllCart();
  if (res.status === 200 && res.data) {
    cart.value = res.data;
    if (cart.value.length === 1) selected.value = cart.value;
  } else {
    window.alert("เกิดข้อผิดพลาด");
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
      await loadData();
      const router = useRouter();
      router.push(`/payment/${res.data.orderId}`);
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error: any) {
    if (error.response.status) {
      if (error.response.data.error === "address.invalid") {
        const router = useRouter();
        router.push("/address");
      } else {
        window.alert(error.response.data.error);
      }
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  }
};

const handleSelectAll = () => {
  if (selected.value.length === cart.value.length) {
    selected.value = [];
  } else {
    selected.value = cart.value;
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
  return selected.value.length === cart.value.length;
});

const isSelect = (item: CartResponse) => {
  return selected.value.findIndex((i) => i.id === item.id) !== -1;
};

await loadData();
</script>
<template>
  <section class="py-2">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mt-8 max-w-2xl md:mt-12">
        <div class="bg-white shadow">
          <div class="px-4 py-6 sm:px-8 sm:py-10" v-if="cart.length > 0">
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
            <UDivider class="mb-10 mt-4" />
            <div class="flow-root">
              <ul class="-my-8">
                <template v-for="item in cart" :key="item.id">
                  <a-cart-item
                    :item="item"
                    :selected="isSelect(item)"
                    :max-quantity="item.maxQuantity"
                    @selected="handleSelect(item)"
                    @update="
                      (quantity) =>
                        handleUpdateCart(
                          item.productId,
                          item.optionId,
                          quantity
                        )
                    "
                    @remove="removeItem(item.id)"
                  />
                </template>
              </ul>
            </div>

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
              <button
                type="button"
                class="group inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800 disabled:transform-none disabled:transition-none disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-white"
                @click="handleCreateOrder"
                :disabled="selected.length === 0"
              >
                ชำระเงิน
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="group-hover:ml-8 ml-4 h-6 w-6 transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div class="px-4 py-6 sm:px-8 sm:py-10" v-else>
            <div class="flex flex-col items-center justify-center">
              <p class="text-2xl font-semibold text-gray-900">
                ไม่มีสินค้าในตะกร้า
              </p>
              <UButton to="/" color="white" variant="solid" class="mt-4">
                กลับไปหน้าแรก
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
