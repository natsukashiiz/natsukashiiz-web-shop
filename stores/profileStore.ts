import type { ProfileResponse } from "~/types";

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<ProfileResponse | null>(null);

  const setProfile = (value: ProfileResponse) => {
    profile.value = value;
  };

  return {
    profile,
    setProfile,
  };
});
