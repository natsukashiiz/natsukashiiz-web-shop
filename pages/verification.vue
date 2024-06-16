<script setup lang="ts">
import { sendVerifyCode, confirmVerifyCode } from "~/api/auth";
import type { FormError } from "@nuxt/ui/dist/runtime/types";

const authStore = useAuthStore();
const route = useRoute();
const toast = useToast();
const loading = ref<boolean>(false);

const form = reactive({
  code: "",
});

const redirect = () => {
  const router = useRouter();
  if (route.query.redirect) {
    router.push(route.query.redirect as string);
  } else {
    router.push("/");
  }
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.code || state.code.length !== 6)
    errors.push({ path: "code", message: "รหัสยืนยันไม่ถูกต้อง" });
  return errors;
};

const handleSendVerifyCode = async () => {
  loading.value = true;

  try {
    const res = await sendVerifyCode();

    if (res.status === 200) {
      toast.add({
        title: "ส่งรหัสยืนยันสำเร็จ",
        description: "กรุณาตรวจสอบอีเมลของท่าน",
        timeout: 10000,
      });
    } else {
      toast.add({
        title: "ส่งรหัสยืนยันไม่สำเร็จ",
        timeout: 3000,
      });
    }
  } catch (error: any) {
    if (error.response.status) {
      if (error.response.data.error === "account.verify.code.invalid") {
        toast.add({
          title: "รหัสยืนยันไม่ถูกต้อง",
          timeout: 3000,
        });
      } else {
        window.alert(error.response.data.error);
      }
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  }
  loading.value = false;
};

const handleConfirmVerifyCode = async () => {
  if (disabled.value) return;

  loading.value = true;
  try {
    const res = await confirmVerifyCode(form.code);

    if (res.status === 200 && res.data) {
      toast.add({
        title: "ยืนยันบัญชีสำเร็จ",
        timeout: 3000,
      });
      authStore.setToken(res.data.token);
      redirect();
    } else {
      toast.add({
        title: "รหัสยืนยันไม่ถูกต้อง",
        timeout: 3000,
      });
    }
  } catch (error: any) {
    if (error.response.status) {
      if (error.response.data.error === "account.verify.code.invalid") {
        toast.add({
          title: "รหัสยืนยันไม่ถูกต้อง",
          timeout: 3000,
        });
      } else {
        window.alert(error.response.data.error);
      }
    } else {
      window.alert("เกิดข้อผิดพลาด");
    }
  }
  loading.value = false;
};

const disabled = computed(() => {
  return !form.code || form.code.length !== 6;
});

if (route.query.code) {
  form.code = route.query.code as string;
}
</script>
<template>
  <UContainer class="flex justify-center">
    <UCard class="mt-24">
      <template #header>
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          ยืนยันตัวตน
        </h1>
      </template>

      <UForm
        :state="form"
        :validate="validate"
        @submit="handleConfirmVerifyCode"
        class="space-y-4 w-96"
      >
        <UFormGroup label="อีเมล" name="email">
          <UInput :value="authStore.payload?.email" disabled />
        </UFormGroup>

        <UFormGroup label="รหัสยืนยัน" name="code">
          <UInput v-model="form.code" />
        </UFormGroup>

        <div class="flex justify-end space-x-2">
          <UButton
            color="white"
            @click="handleSendVerifyCode"
            :loading="loading"
          >
            รับรหัสยืนยันใหม่
          </UButton>
          <UButton type="submit" :disabled="disabled" :loading="loading">
            ยืนยันตัวตน
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
