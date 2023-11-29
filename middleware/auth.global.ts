const allows = [
  "login",
  "register",
  "index",
  "products-id",
  "reset-password",
  "forgot-password",
];

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const isLogin = authStore.loadAuth();

  // ตรวจสอบว่าเข้ามายังหน้าที่ไม่ได้เป็นหน้ายืนยันตัวตนหรือไม่
  if (isLogin) {
    to.meta.layout = "auth";

    // ถ้ายังไม่ได้ยืนยันตัวตน และเข้ามายังหน้าที่ไม่ได้เป็นหน้ายืนยันตัวตน ให้เด้งไปยังหน้ายืนยันตัวตน
    if (to.name !== "verification" && !authStore.payload?.verified) {
      return navigateTo({ name: "verification" });
    }

    // ถ้ามีการยืนยันตัวตนแล้ว และเข้ามายังหน้ายืนยันตัวตนอีกครั้ง ให้เด้งไปหน้าหลัก
    if (to.name === "verification" && authStore.payload?.verified) {
      return navigateTo({ name: "index" });
    }
  } else {
    if (to.name === "verification") {
      return navigateTo({ name: "login", query: { redirect: to.fullPath } });
    }

    if (!allows.includes(to.name as string)) {
      authStore.removeToken();
      return navigateTo({ name: "login" });
    }
  }
});
