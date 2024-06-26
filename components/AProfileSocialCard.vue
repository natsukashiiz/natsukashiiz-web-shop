<script setup lang="ts">
import type { AccountSocialResponse } from "~/types";
import { SocialProviders } from "~/types/enum";

defineProps({
  socials: {
    type: Array as PropType<AccountSocialResponse[]>,
    required: true,
  },
});

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
</script>

<template>
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

  <UCard>
    <template #header>
      <span class="text-lg font-semibold text-gray-900"> บัญชีสังคม </span>
    </template>

    <template #default>
      <div v-if="socials.length > 0">
        <ul class="space-y-2">
          <li v-for="social in socials" :key="social.provider">
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
                    :disabled="socials.length === 1"
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
</template>
