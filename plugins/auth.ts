export default defineNuxtPlugin(async () => {
  const { loadAuth } = useAuthStore();
  const authenticated = await loadAuth();

  if (authenticated) {
    const { loadProfile } = useProfileStore();
    await loadProfile();
    const { loadCountCart } = useCartStore();
    await loadCountCart();
  }
});
