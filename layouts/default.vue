<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const { isMobile } = useDevice();
const divClass = isMobile ? "pt-24 min-h-screen" : "pt-14 min-h-screen";

const colorMode = useColorMode();
colorMode.preference = "light";

const subscribeServer = () => {
  const event = new EventSource(
    "http://localhost:8080/v1/notifications/subscribe?Authorization=" +
      authStore.token
  );
  event.addEventListener("NOTIFY", async function (event) {
    if (event.data === "ORDER") {
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
  });
};

onBeforeMount(() => {
  authStore.loadAuth();
  if (authStore.isAuth) {
    subscribeServer();
  }
});
</script>
<template>
  <a-top-bar />
  <div :class="divClass">
    <slot />
  </div>
  <UNotifications />
</template>
<style>
body {
  font-family: Mitr, sans-serif;
}
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
