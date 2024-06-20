<script setup lang="ts">
import type { OptionResponse, ProductResponse } from "~/types";
import { getOneProduct } from "~/api/product";
import { useAuthStore } from "~/stores/authStore";
import { updateCart, getCountCart } from "~/api/cart";

const authStore = useAuthStore();
const cartStore = useCartStore();

const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = useLoading();

const product = ref<ProductResponse>();
const currentOption = ref<OptionResponse>();
const quantity = ref(1);

const adding = ref(false);

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

const handleUpdateCart = async () => {
  if (!authStore.isAuth) {
    router.push(`/login?redirect=${route.fullPath}`);
    return;
  }

  if (!product.value || !currentOption.value) return;

  adding.value = true;
  try {
    const res = await updateCart([
      {
        productId: product.value.id,
        optionId: currentOption.value?.id,
        quantity: quantity.value,
        selected: false,
      },
    ]);

    if (res.status === 200 && res.data) {
      toast.clear();
      toast.add({
        id: "add-cart",
        title: "เพิ่มสินค้าลงตะกร้าสำเร็จ",
        description: "สินค้าถูกเพิ่มลงตะกร้าสำเร็จ",
        timeout: 2000,
        click: () => {
          router.push({
            name: "cart",
          });
          toast.remove("add-cart");
        },
      });
      await fetchCountCart();
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error) {
    console.error(error);
  }
  adding.value = false;
};

const handleCreateOrder = async () => {
  if (!authStore.isAuth) {
    router.push(`/login?redirect=${route.fullPath}`);
    return;
  }

  if (!product.value || !currentOption.value) return;

  loading.value = true;
  try {
    const res = await updateCart([
      {
        productId: product.value.id,
        optionId: currentOption.value?.id,
        quantity: quantity.value,
        selected: true,
      },
    ]);

    if (res.status === 200 && res.data) {
      router.push({
        name: "cart",
      });
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
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

onActivated(() => {
  loadData();
});
</script>
<template>
  <div
    class="max-w-5xl mx-auto flex flex-col items-center justify-center space-y-2 p-4"
    v-if="product && currentOption"
  >
    <Head>
      <title>{{ product.name }}</title>
      <meta name="description" :content="product.description" />
      <meta property="og:title" :content="product.name" />
      <meta property="og:description" :content="product.description" />
      <meta property="og:image" :content="product.thumbnail" />
      <meta property="og:url" :content="$route.fullPath" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="shop.natsukashiiz.online" />
      <meta property="og:locale" content="th_TH" />
    </Head>
    <div class="bg-white border border-gray-200 rounded-lg shadow pb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-8 mb-3">
        <AProductCarousel :items="product.images" preview />
        <div class="px-5 pb-5">
          <div class="flex items-center gap-2 mt-2">
            <span class="text-sm text-gray-500"> หมวดหมู่: </span>
            <UBadge color="white" variant="solid" size="sm">
              {{ product.category.name }}
            </UBadge>
          </div>
          <h5 class="text-xl font-semibold tracking-tight text-gray-900 mt-2">
            {{ product.name }}
          </h5>
          <div class="flex flex-wrap items-center gap-2 mt-2">
            <template v-for="option in product.options" :key="option.id">
              <UButton
                :color="option.id === currentOption.id ? 'primary' : 'white'"
                size="xs"
                @click="changeOption(option)"
              >
                {{ option.name.toUpperCase() }}
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
              / {{ currentOption.quantity }} ชิ้น
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold text-gray-900">
              ฿<ACurrency :amount="currentOption.price" />
            </span>
            <span
              class="text-white bg-red-600 font-medium rounded-lg text-sm px-3 py-1.5 text-center"
              @click="handleUpdateCart"
              v-if="currentOption.quantity <= 0"
            >
              สินค้าหมด
            </span>
            <template v-else-if="currentOption.quantity > 0">
              <div class="flex gap-2">
                <UButton
                  color="white"
                  @click="handleUpdateCart"
                  :loading="adding"
                >
                  เพิ่มลงตะกร้า
                </UButton>
                <UButton @click="handleCreateOrder" :disabled="loading">
                  ซื้อสินค้า
                </UButton>
              </div>
            </template>
          </div>
          <div class="flex items-center gap-2 mt-4 justify-between">
            <div class="flex gap-1">
              <SocialShare
                v-for="network in ['facebook', 'twitter']"
                :key="network"
                :network="network"
                class="text-white"
                :styled="true"
                :label="false"
              />
            </div>
            <AProductFavoriteButton
              :productId="product.id"
              v-if="authStore.isAuth"
            />
          </div>
        </div>
      </div>
      <UDivider label="สถิติ" color="gray" />
      <div class="flex justify-around mt-4 mb-2 mx-2">
        <span>จำนวนผู้เข้าชม: {{ product.views }}</span>
        <span>จำนวนการสั่ง: {{ product.orders }}</span>
      </div>
      <UDivider label="รายละเอียด" color="gray" />
      <div class="px-5 py-2">
        <p class="text-sm text-gray-700 text-pretty">
          {{ product.description }}
        </p>
      </div>
    </div>
    <AProductReviewList :product="product" @load-product="loadData" />
  </div>
</template>
