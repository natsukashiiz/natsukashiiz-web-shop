<script setup lang="ts">
import { resetPassword } from "~/api/auth";
import type { FormError } from "#ui/types";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const loading = ref<boolean>(false);

const form = reactive({
  email: "",
  code: "",
  password: "",
});

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "กรุณากรอกอีเมล" });
  if (!state.code)
    errors.push({ path: "code", message: "กรุณากรอกรหัสยืนยัน" });
  if (!state.password)
    errors.push({ path: "password", message: "กรุณากรอกรหัสผ่านใหม่" });
  return errors;
};

const handleResetPassword = async () => {
  if (disabled.value) return;

  loading.value = true;
  try {
    const res = await resetPassword(form);

    if (res.status === 200 && res.data) {
      toast.add({
        title: "ยืนยันบัญชีสำเร็จ",
        timeout: 3000,
      });
      authStore.setToken(res.data.token);
      router.push("/");
    } else {
      toast.add({
        title: "รหัสยืนยันไม่ถูกต้อง",
        timeout: 3000,
      });
    }
  } catch (error: any) {
    if (error.response.status) {
      if (error.response.data.error === "account.reset.code.invalid") {
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
  return !form.email || !form.code || !form.password;
});

if (route.query.email && route.query.code) {
  form.email = route.query.email as string;
  form.code = route.query.code as string;
} else {
  router.push({ name: "forgot-password" });
}
</script>
<template>
  <UContainer class="flex justify-center">
    <UCard class="mt-24">
      <template #header>
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          รีเซ็ตรหัสผ่าน
        </h1>
      </template>

      <UForm
        :state="form"
        :validate="validate"
        @submit="handleResetPassword"
        class="space-y-4 w-96"
      >
        <UFormGroup label="อีเมล" name="email">
          <UInput v-model="form.email" disabled />
        </UFormGroup>

        <UFormGroup label="รหัสยืนยัน" name="code">
          <UInput v-model="form.code" disabled />
        </UFormGroup>

        <UFormGroup label="รหัสผ่านใหม่" name="password">
          <UInput v-model="form.password" type="password" />
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
