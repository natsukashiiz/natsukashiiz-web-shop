<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { singup } from "~/api/auth";
import type { FormError } from "#ui/types";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const loading = useLoading();

const form = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const redirect = () => {
  if (route.query.redirect) {
    router.push(route.query.redirect as string);
  } else {
    router.push("/");
  }
};

const handleRegister = async () => {
  if (disabled.value) return;

  if (form.password !== form.confirmPassword) {
    window.alert("รหัสผ่านไม่ตรงกัน");
    return;
  }

  loading.value = true;

  try {
    const res = await singup({
      email: form.email,
      password: form.password,
    });

    if (res.status === 200 && res.data) {
      toast.add({
        title: "สำเร็จ",
        description: "สมัครสมาชิกสำเร็จ",
        timeout: 3000,
      });

      await authStore.transfer(res.data);
      router.push({ name: "verification" });
    } else {
      window.alert("มีบางอย่างผิดพลาด");
    }
  } catch (error: any) {
    console.error(error);
    if (error.response.data.error === "signUp.email.duplicate") {
      toast.add({
        title: "อีเมลนี้เคยลงทะเบียนแล้ว",
        timeout: 3000,
      });
    }
  }

  loading.value = false;
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "อีเมลไม่ถูกต้อง" });
  if (!state.password)
    errors.push({ path: "password", message: "รหัสผ่านไม่ถูกต้อง" });
  if (!state.confirmPassword)
    errors.push({ path: "confirmPassword", message: "รหัสผ่านไม่ถูกต้อง" });
  if (state.password !== state.confirmPassword)
    errors.push({ path: "confirmPassword", message: "รหัสผ่านไม่ตรงกัน" });
  return errors;
};

const disabled = computed(() => {
  return !form.email || !form.password || !form.confirmPassword;
});

onMounted(() => {
  if (authStore.authenticated) {
    redirect();
  }
});
</script>
<template>
  <Head>
    <title>ลงทะเบียน</title>
  </Head>
  <UContainer class="flex justify-center">
    <UCard class="mt-24 w-11/12 md:w-96">
      <template #header>
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          ลงทะเบียน
        </h1>
      </template>

      <UForm
        :state="form"
        :validate="validate"
        @submit="handleRegister"
        class="space-y-4"
      >
        <UFormGroup label="อีเมล" name="email">
          <UInput v-model="form.email" type="email" />
        </UFormGroup>

        <UFormGroup label="รหัสผ่าน" name="password">
          <UInput v-model="form.password" type="password" />
        </UFormGroup>

        <UFormGroup
          label="รหัสผ่านอีกครั้ง"
          name="confirmPassword"
          type="password"
        >
          <UInput v-model="form.confirmPassword" type="password" />
        </UFormGroup>

        <div class="flex justify-end">
          <UButton
            color="white"
            type="submit"
            :disabled="disabled"
            :loading="loading"
            block
          >
            ลงทะเบียน
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
