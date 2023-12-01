<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const { isMobile } = useDevice();
const divClass = isMobile ? "pt-24 min-h-screen" : "pt-14 min-h-screen";

const subscribeServer = () => {
  const event = new EventSource(
    "http://localhost:8080/v1/notifications/subscribe?Authorization=" +
      authStore.token
  );
  event.addEventListener("EVENT", async function (event) {
    const data = JSON.parse(event.data) as PAYLOAD;

    if (data.type === "ORDER") {
      toast.add({
        id: "NOTIFY-ORDER",
        title: "รายการสั่งซื้อมีการเปลี่ยนแปลง",
        description: "รายการสั่งซื้อมีการเปลี่ยนแปลง",
        click: () => {
          router.push("/orders/history");
          toast.remove("NOTIFY-ORDER");
        },
      });
    }

    if (data.type === "PAYMENT") {
      const orderId = (route.params as any).orderId;
      if (orderId === data.orderId) {
        router.push("/orders/detail/" + data.orderId);
      }
    }
  });
};

interface PAYLOAD {
  type: string;
  from?: number;
  to?: number;
  message?: string;
  orderId?: number;
}

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
