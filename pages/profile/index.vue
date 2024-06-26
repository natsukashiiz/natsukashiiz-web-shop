<script setup lang="ts">
import { queryProfile, deleteAccount } from "~/api/profile";
import type { ProfileResponse } from "~/types";
import { SocialProviders } from "~/types/enum";

const authStore = useAuthStore();
const loading = useLoading();
const profile = ref<ProfileResponse | null>(null);

const loadData = async () => {
  loading.value = true;
  try {
    const res = await queryProfile();
    if (res.status === 200 && res.data) {
      profile.value = res.data;
    }
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
};

const modalDeleteAccount = ref(false);
const handleDeleteAccount = async () => {
  try {
    const res = await deleteAccount();
    if (res.status === 200) {
      authStore.logout();
      modalDeleteAccount.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

const icons = {
  [SocialProviders.GOOGLE]: "logos:google-icon",
  [SocialProviders.FACEBOOK]: "logos:facebook",
};

const getIcon = (provider: SocialProviders): string => icons[provider];

const modalDeleteSocial = ref(false);
const handleShowModalDeleteSocial = (provider: SocialProviders) => {
  console.log(provider);
  modalDeleteSocial.value = true;
};
const handleDeleteSocial = async (provider: SocialProviders) => {
  console.log(provider);
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
  <AModal
    title="ลบบัญชี"
    label="ยืนยันการลบบัญชี"
    description="คุณต้องการลบบัญชีของคุณหรือไม่ ถ้าคุณลบบัญชีของคุณ ข้อมูลของคุณจะถูกลบอย่างถาวรและไม่สามารถกู้คืนได้"
    :modal="modalDeleteAccount"
    confirm-text="ยืนยัน"
    cancel-text="ยกเลิก"
    @confirm="handleDeleteAccount"
    @close="modalDeleteAccount = false"
    confirmColor="red"
  />
  <AModal
    title="ยกเลิกการเชื่อมต่อบัญชีสังคม"
    label="ยืนยันการยกเลิกการเชื่อมต่อบัญชีสังคม"
    description="คุณต้องการยกเลิกการเชื่อมต่อบัญชีสังคมหรือไม่"
    :modal="modalDeleteSocial"
    confirm-text="ยืนยัน"
    cancel-text="ยกเลิก"
    @confirm="handleDeleteSocial"
    @close="modalDeleteSocial = false"
    confirmColor="red"
  />
  <UContainer v-if="profile" class="max-w-xl py-5 flex flex-col space-y-4">
    <AProfileForm
      :profile="profile"
      @update-profile="(newProfile) => (profile = newProfile)"
    />

    <UCard>
      <template #header>
        <span class="text-lg font-semibold text-gray-900"> บัญชีสังคม </span>
      </template>

      <template #default>
        <div v-if="profile.socials.length > 0">
          <ul class="space-y-2">
            <li v-for="social in profile.socials" :key="social.provider">
              <div class="flex flex-row justify-between">
                <div class="flex flex-row items-center space-x-2">
                  <Icon
                    :name="getIcon(social.provider)"
                    size="1.5em"
                    class="bg-gray-100"
                  />
                  <span class="text-gray-900">{{ social.provider }}</span>
                </div>
                <div>
                  <UTooltip text="ยกเลิกการเชื่อมต่อบัญชี">
                    <UButton
                      icon="i-heroicons-trash"
                      color="red"
                      size="xs"
                      variant="ghost"
                      :disabled="profile.socials.length === 1"
                      @click="handleShowModalDeleteSocial(social.provider)"
                    />
                  </UTooltip>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div v-else>
          <p class="text-gray-500">ไม่มีบัญชีสังคม</p>
        </div>
      </template>
    </UCard>

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

    <UCard>
      <template #header>
        <span class="text-lg font-semibold text-gray-900">
          การจัดการบัญชี
        </span>
      </template>

      <template #default>
        <UButton
          class="mt-2"
          icon="i-heroicons-trash"
          color="red"
          block
          @click="modalDeleteAccount = true"
        >
          ลบบัญชี
        </UButton>
      </template>
    </UCard>
  </UContainer>
</template>
