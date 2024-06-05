<script setup lang="ts">
import type { OptionResponse, ProductResponse } from "~/types";
import { getOneProduct } from "~/api/product";
import { useAuthStore } from "~/stores/authStore";
import { addCart } from "~/api/cart";
import { createOrder } from "~/api/order";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const product = ref<ProductResponse>();
const currentOption = ref<OptionResponse>();
const quantity = ref(1);

const loadData = async () => {
  const res = await getOneProduct(Number((route.params as any).id));

  if (res.status === 200 && res.data) {
    product.value = res.data;
    currentOption.value = res.data.options[0];
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const changeOption = (option: OptionResponse) => {
  quantity.value = 1;
  currentOption.value = option;
};

const handleAddCart = async () => {
  if (!authStore.isAuth) {
    router.push(`/login?redirect=${route.fullPath}`);
    return;
  }

  if (!product.value || !currentOption.value) return;

  const res = await addCart({
    productId: product.value.id,
    optionId: currentOption.value?.id,
    quantity: quantity.value,
  });

  if (res.status === 200 && res.data) {
    toast.add({
      id: "add-cart",
      title: "เพิ่มสินค้าลงตะกร้าสำเร็จ",
      description: "สินค้าถูกเพิ่มลงตะกร้าสำเร็จ",
      timeout: 2000,
      click: () => {
        router.push("/cart");
        toast.remove("add-cart");
      },
    });
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const handleCreateOrder = async () => {
  if (!authStore.isAuth) {
    router.push(`/login?redirect=${route.fullPath}`);
    return;
  }

  if (!product.value || !currentOption.value) return;

  try {
    const res = await createOrder([
      {
        productId: product.value.id,
        optionId: currentOption.value.id,
        quantity: quantity.value,
      },
    ]);
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

onMounted(async () => {
  await loadData();
});
</script>
<template>
  <div class="flex justify-center mt-10" v-if="product && currentOption">
    <div
      class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow pb-4"
    >
      <img
        class="p-8 rounded-t-lg w-full h-72 object-cover"
        :src="product.thumbnail"
        alt="product image"
      />
      <div class="px-5 pb-5">
        <h5 class="text-xl font-semibold tracking-tight text-gray-900">
          {{ product.name }}
        </h5>
        <div class="flex flex-wrap items-center gap-2 mt-2">
          <template v-for="option in product.options" :key="option.id">
            <UButton
              :color="option.id === currentOption.id ? 'primary' : 'white'"
              size="xs"
              @click="changeOption(option)"
            >
              {{ option.name }}
            </UButton>
          </template>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm font-medium text-gray-900"> จำนวน </span>
          <div class="flex items-center gap-2">
            <button
              class="text-gray-500 rounded-full hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
              @click="quantity--"
              :disabled="quantity <= 1"
            >
              <span class="sr-only">minus</span>
              <svg
                class="w-4 h-4"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5 10C4.44772 10 4 9.55228 4 9C4 8.44772 4.44772 8 5 8H15C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10H5Z"
                />
              </svg>
            </button>
            <span class="text-gray-700">{{ quantity }}</span>
            <button
              class="text-gray-500 rounded-full hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
              @click="quantity++"
              :disabled="quantity >= currentOption.quantity"
            >
              <span class="sr-only">plus</span>
              <svg
                class="w-4 h-4"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10 4C10.5523 4 11 4.44772 11 5V15C11 15.5523 10.5523 16 10 16C9.44772 16 9 15.5523 9 15V5C9 4.44772 9.44772 4 10 4Z"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4 10C4 9.44772 4.44772 9 5 9H15C15.5523 9 16 9.44772 16 10C16 10.5523 15.5523 11 15 11H5C4.44772 11 4 10.5523 4 10Z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-gray-900">
            ฿<ACurrency :amount="currentOption.price" />
          </span>
          <span
            class="text-white bg-red-600 font-medium rounded-lg text-sm px-3 py-1.5 text-center"
            @click="handleAddCart"
            v-if="currentOption.quantity <= 0"
          >
            สินค้าหมด
          </span>
          <template v-else-if="currentOption.quantity > 0">
            <div class="flex gap-2">
              <UButton color="white" @click="handleAddCart">
                เพิ่มลงตะกร้า
              </UButton>
              <UButton color="blue" @click="handleCreateOrder">
                ซื้อสินค้า
              </UButton>
            </div>
          </template>
        </div>
      </div>
      <UDivider label="รายละเอียด" color="gray" />
      <div class="flex justify-around mt-4 mb-2 mx-2">
        <span>จำนวนผู้เข้าชม: {{ product.views }}</span>
        <span>จำนวนการสั่ง: {{ product.orders }}</span>
      </div>
      <UDivider label="แชร์สินค้านี้" color="gray" />
      <div class="flex justify-center flex-row gap-10 mt-4">
        <SocialShare
          v-for="network in ['facebook', 'twitter', 'telegram']"
          :key="network"
          :network="network"
          class="hover:text-rose-500"
        />
      </div>
    </div>
  </div>
</template>
