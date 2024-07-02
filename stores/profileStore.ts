import { queryProfile } from "~/api/profile";
import type { ProfileResponse } from "~/types";

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<ProfileResponse | null>(null);

  const setProfile = (value: ProfileResponse) => {
    profile.value = value;
  };

  const loadProfile = async () => {
    try {
      const res = await queryProfile();
      if (res.status === 200 && res.data) {
        setProfile(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    profile,
    setProfile,
    loadProfile,
  };
});
