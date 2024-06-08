<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import type { NotificationResponse } from "~/types";
import { OrderStatus } from "~/types/enum";

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const { isMobile } = useDevice();
const divClass = isMobile ? "pt-24 min-h-screen" : "pt-14 min-h-screen";

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
          name: "orders-detail-id",
          params: {
            id: data.eventId,
          },
        });
      },
    });

    if (route.name === "payment-orderId") {
      router.replace({
        name: "orders-detail-id",
        params: {
          id: data.eventId,
        },
      });
    }

    if (route.name === "orders-detail-id") {
      router.go(0);
    }
  });
};

onBeforeMount(() => {
  subscribeServer();
});
</script>
<template>
  <NuxtLoadingBar />
  <a-top-bar-auth />
  <div :class="divClass">
    <slot />
  </div>
  <UNotifications />
</template>
<style>
body {
  font-family: Mitr, sans-serif;
}
</style>
