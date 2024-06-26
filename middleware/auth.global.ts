import client from "~/api/request";

const allows = [
  "login",
  "register",
  "index",
  "products-id",
  "reset-password",
  "forgot-password",
  "categoies-id",
  "products-search",
  "vouchers",
];

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  if (!authStore.authenticated) {
    await authStore.loadAuth();
  }

  // ตรวจสอบว่าเข้ามายังหน้าที่ไม่ได้เป็นหน้ายืนยันตัวตนหรือไม่
  if (authStore.authenticated) {
    to.meta.layout = "authenticated";

    client.defaults.headers.common.Authorization = `Bearer ${authStore.accessToken}`;

    // ถ้ายังไม่ได้ยืนยันตัวตน และเข้ามายังหน้าที่ไม่ได้เป็นหน้ายืนยันตัวตน ให้เด้งไปยังหน้ายืนยันตัวตน
    if (to.name !== "verification" && !authStore.payload?.verified) {
      return navigateTo({ name: "verification" });
    }

    // ถ้ามีการยืนยันตัวตนแล้ว และเข้ามายังหน้ายืนยันตัวตนอีกครั้ง ให้เด้งไปหน้าหลัก
    if (to.name === "verification" && authStore.payload?.verified) {
      return navigateTo({ name: "index" });
    }
  } else {
    to.meta.layout = "guest";

    if (to.name === "verification") {
      return navigateTo({ name: "login", query: { redirect: to.fullPath } });
    }

    if (!allows.includes(to.name as string)) {
      authStore.removeToken();
      return navigateTo({ name: "login" });
    }
  }
});
