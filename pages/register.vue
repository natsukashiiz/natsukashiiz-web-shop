<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { singup } from "~/api/auth";
import type { FormError } from "@nuxt/ui/dist/runtime/types";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const loading = ref(false);

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

    authStore.setToken(res.data.token);
    router.push({ name: "verification" });
  } else {
    window.alert("มีบางอย่างผิดพลาด");
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
  if (authStore.isAuth) {
    redirect();
  }
});
</script>
<template>
  <UContainer class="flex justify-center">
    <UCard class="mt-24">
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
        class="space-y-4 w-96"
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
