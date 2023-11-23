<script setup lang="ts">
import type { CartResponse } from "~/types";
import { getAllCart, deleteCart, addCart } from "~/api/cart";
import { createOrder } from "~/api/order";

const cart = ref<CartResponse[]>([]);

const loadData = async () => {
  const res = await getAllCart();
  if (res.status === 200 && res.data) {
    cart.value = res.data;
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
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error: any) {
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
    await loadData();
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const totalPrice = computed(() => {
  return cart.value.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
});

const handleCreateOrder = async () => {
  const data = cart.value.map((item) => {
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
};

onMounted(async () => {
  await loadData();
});
</script>
<template>
  <section class="py-2">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mx-auto mt-8 max-w-2xl md:mt-12">
        <div class="bg-white shadow">
          <div class="px-4 py-6 sm:px-8 sm:py-10" v-if="cart.length > 0">
            <div class="flow-root">
              <ul class="-my-8">
                <template v-for="item in cart" :key="item.id">
                  <a-cart-item
                    :item="item"
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
                  ฿{{ totalPrice }}
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
                <span class="text-xs font-normal text-gray-400">THB</span>
                {{ totalPrice }}
              </p>
            </div>

            <div class="mt-6 text-center">
              <button
                type="button"
                class="group inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                @click="handleCreateOrder"
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
              <router-link
                to="/"
                class="mt-4 inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
              >
                กลับไปหน้าแรก
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
