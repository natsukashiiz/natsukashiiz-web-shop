<script setup lang="ts">
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
    }/v1/notifications/subscribe?Authorization=${authStore.accessToken}`
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
          name: "profile-history-orders-orderId",
          params: {
            orderId: data.eventId,
          },
        });
      },
    });

    if (route.name === "payment-orderId") {
      router.replace({
        name: "profile-history-orders-orderId",
        params: {
          orderId: data.eventId,
        },
      });
    }

    if (route.name === "profile-history-orders-orderId") {
      router.go(0);
    }
  });
};

onNuxtReady(() => {
  subscribeServer();
});
</script>
<template>
  <NuxtLoadingBar />
  <UNotifications
    :ui="{ position: '-top-2 md:top-12 bottom-auto right-0 left-0 mx-auto' }"
  />
  <a-top-bar-auth :countCart="cartStore.count" />
  <div class="pb-24 md:pt-14 min-h-screen">
    <NuxtPage keepalive />
  </div>
  <a-bottom-bar-auth />
</template>
<style>
body {
  font-family: Mitr, sans-serif;
}
</style>
