<script setup lang="ts">
import { queryProfile } from "~/api/profile";
import type { ProfileResponse } from "~/types";

const profileStore = useProfileStore();
const loading = useLoading();
const profile = ref<ProfileResponse | null>(null);

const loadData = async () => {
  loading.value = true;
  try {
    const res = await queryProfile();
    if (res.status === 200 && res.data) {
      profile.value = res.data;
      profileStore.setProfile(res.data);
    }
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
};

const updateProfile = (newProfile: ProfileResponse) => {
  profile.value = newProfile;
  profileStore.setProfile(newProfile);
};

await loadData();
onActivated(() => {
  loadData();
});
</script>
<template>
  <Head>
    <title>Profile</title>
  </Head>

  <UContainer v-if="profile" class="max-w-xl py-5 flex flex-col space-y-4">
    <AProfileForm :profile="profile" @update-profile="updateProfile" />
    <AProfileSocialCard :socials="profile.socials" />
    <AChangePasswordForm />

    <UCard>
      <template #header>
        <span class="text-lg font-semibold text-gray-900"> ลืมรหัสผ่าน </span>
      </template>

      <template #default>
        <UButton class="mt-2" color="white" block to="/forgot-password">
          ลืมรหัสผ่าน
        </UButton>
      </template>
    </UCard>

    <AProfileDeleteCard />
  </UContainer>
</template>
