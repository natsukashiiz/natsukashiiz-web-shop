const ignoeAuthRoutes = ["login", "index", "products-id"];

export default defineNuxtRouteMiddleware((to, from) => {
  if (!ignoeAuthRoutes.includes(to.name as string)) {
    const authStore = useAuthStore();
    if (!authStore.loadAuth()) {
      authStore.removeToken();
      return navigateTo({ name: "login" });
    } else {
      to.meta.layout = "auth";
    }
  }
});
