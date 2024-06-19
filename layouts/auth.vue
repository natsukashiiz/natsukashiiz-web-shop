<script setup lang="ts">
import { getCountCart } from "~/api/cart";
import { useAuthStore } from "~/stores/authStore";
import type { NotificationResponse } from "~/types";
import { OrderStatus } from "~/types/enum";

const authStore = useAuthStore();
const cartStore = useCartStore();

const toast = useToast();
const router = useRouter();
const route = useRoute();

const subscribeServer = () => {
  const event = new EventSource(
    `${
      import.meta.env.VITE_API_BASEURL
    }/v1/notifications/subscribe?Authorization=${authStore.token}`
  );
  event.addEventListener("ORDER", async function (event) {
    const data = JSON.parse(event.data) as NotificationResponse;

    toast.add({
      id: data.type,
      title: data.title,
      description: data.content,
      timeout: 2500,
      click: () => {
        router.replace({
          name: "orders-detail-orderId",
          params: {
            orderId: data.eventId,
          },
        });
      },
    });

    if (route.name === "payment-orderId") {
      router.replace({
        name: "orders-detail-orderId",
        params: {
          orderId: data.eventId,
        },
      });
    }

    if (route.name === "orders-detail-orderId") {
      router.go(0);
    }
  });
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

onBeforeMount(async () => {
  await fetchCountCart();

  subscribeServer();
});

const { isMobile } = useDevice();
const divClass = isMobile ? "pt-24 min-h-screen" : "pt-14 min-h-screen";
</script>
<template>
  <NuxtLoadingBar />
  <a-top-bar-auth :countCart="cartStore.count" />
  <div :class="divClass">
    <UNotifications
      :ui="{ position: 'top-12 bottom-auto right-0 left-0 mx-auto' }"
    />
    <NuxtPage keepalive />
  </div>
</template>
<style>
body {
  font-family: Mitr, sans-serif;
}
</style>
