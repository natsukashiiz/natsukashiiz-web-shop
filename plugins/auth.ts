export default defineNuxtPlugin(async () => {
  const { loadAuth, authenticated } = useAuthStore();
  await loadAuth();

  if (authenticated) {
    const { loadProfile } = useProfileStore();
    await loadProfile();
  }
});
