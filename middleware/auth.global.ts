const requireAuth = ["/cart", "/orders/history"];

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  if (requireAuth.includes(to.path)) {
    if (!authStore.isAuth) {
      return navigateTo("/login");
    }
  }
});
