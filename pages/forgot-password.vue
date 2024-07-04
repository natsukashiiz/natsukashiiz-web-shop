<script setup lang="ts">
import { forgotPassword } from "~/api/auth";
import type { FormError } from "#ui/types";
import type { ForgotPasswordRequest } from "~/types";

const toast = useToast();
const loading = useLoading();
const route = useRoute();

const form = reactive<ForgotPasswordRequest>({
  email: "",
});

const validate = (state: ForgotPasswordRequest): FormError[] => {
  const errors = [];
  if (!state.email)
    errors.push({ path: "email", message: "กรุณากรอกอีเมลของคุณ" });
  return errors;
};

const handleForgotPassword = async () => {
  loading.value = true;

  try {
    const res = await forgotPassword(form);

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
      if (error.response.data.error === "account.invalid") {
        toast.add({
          title: "อีเมลไม่ถูกต้อง",
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
  return !form.email;
});

onMounted(() => {
  const email = route.query.email as string;
  if (email) {
    form.email = email;
  }
});
</script>
<template>
  <Head>
    <title>ลืมรหัสผ่าน</title>
  </Head>
  <UContainer class="flex justify-center">
    <UCard class="mt-24">
      <template #header>
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          ลืมรหัสผ่าน
        </h1>
      </template>

      <UForm
        :state="form"
        :validate="validate"
        @submit="handleForgotPassword"
        class="space-y-4 w-96"
      >
        <UFormGroup label="อีเมล" name="email">
          <UInput v-model="form.email" />
        </UFormGroup>

        <div class="flex justify-end space-x-2">
          <UButton type="submit" :disabled="disabled" :loading="loading">
            ยืนยัน
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
