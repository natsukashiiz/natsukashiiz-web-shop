<script setup lang="ts">
import type { OptionResponse, ProductResponse } from "~/types";
import { getOneProduct } from "~/api/product";
import { useAuthStore } from "~/stores/authStore";
import { addCart } from "~/api/cart";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const productDatil = ref<ProductResponse>();
const currentOption = ref<OptionResponse>();
const quantity = ref(1);

const loadData = async () => {
  const res = await getOneProduct(Number(route.params.id));

  if (res.status === 200 && res.data) {
    productDatil.value = res.data;
    currentOption.value = res.data.options[0];
  } else {
    window.alert("เกิดข้อผิดพลาด");
  }
};

const changePrice = (option: OptionResponse) => {
  currentOption.value = option;
};

const handleAddCart = async () => {
  if (!productDatil.value || !currentOption.value) return;

  const res = await addCart({
    productId: productDatil.value?.id,
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

onMounted(async () => {
  await loadData();
});
</script>
<template>
  <div class="flex justify-center mt-10">
    <div
      class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <a href="#">
        <img
          class="p-8 rounded-t-lg w-full h-72 object-cover"
          src="data:image/jpeg;base64,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"
          alt="product image"
        />
      </a>
      <div class="px-5 pb-5">
        <a href="#">
          <h5
            class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
          >
            {{ productDatil?.name }}
          </h5>
        </a>
        <div class="flex items-center gap-2 mt-2">
          <template v-for="option in productDatil?.options" :key="option.id">
            <button
              :class="`text-black bg-rose-${
                option.id === currentOption?.id ? '400' : '100'
              } p-1 font-medium rounded-lg text-sm text-center`"
              @click="changePrice(option)"
            >
              {{ option.name }}
            </button>
          </template>
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-sm font-medium text-gray-900 dark:text-gray-50">
            จำนวน
          </span>
          <div class="flex items-center gap-2">
            <button
              class="text-gray-500 rounded-full hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
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
            <span class="text-gray-700 dark:text-gray-300">{{ quantity }}</span>
            <button
              class="text-gray-500 rounded-full hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
              @click="quantity++"
              :disabled="quantity >= currentOption?.quantity"
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
          <span class="text-3xl font-bold text-gray-900 dark:text-white">
            ฿{{ currentOption?.price }}</span
          >
          <button
            class="text-white bg-blue-700 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            @click="handleAddCart"
            v-if="authStore.isAuth && currentOption?.quantity > 0"
          >
            เพิ่มลงตะกร้า
          </button>
          <button
            class="text-white bg-red-600 font-medium rounded-lg text-sm px-3 py-2 text-center"
            @click="handleAddCart"
            v-if="currentOption?.quantity === 0"
          >
            สินค้าหมด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
