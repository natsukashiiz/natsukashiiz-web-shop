export default defineNuxtPlugin(async () => {
  console.log("AuthPlugin");

  const { loadAuth, authenticated } = useAuthStore();
  await loadAuth();
  console.log("LoadAuth", authenticated);

  if (authenticated) {
    console.log("LoadProfile");
    const { loadProfile } = useProfileStore();
    await loadProfile();
  }
});
