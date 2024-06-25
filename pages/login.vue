<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { google, login } from "~/api/auth";
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";
import type { FormError } from "#ui/types";

const turnstileToken = ref<string>();

// handle success event
const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;
  await handleGoogle(credential as string);
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};

const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();
const loading = useLoading();

const form = reactive({
  email: "",
  password: "",
});

const redirect = () => {
  const router = useRouter();
  if (route.query.redirect) {
    router.replace(route.query.redirect as string);
  } else {
    router.replace({
      name: "index",
    });
  }
};

const handleLogin = async () => {
  if (disabled.value) return;

  loading.value = true;
  try {
    const res = await login(form);

    if (res.status === 200 && res.data) {
      await authStore.transfer(res.data);
      redirect();
    } else {
      window.alert("มีบางอย่างผิดพลาด");
    }
  } catch (error: any) {
    if (error.response.status) {
      if (error.response.data.error === "login.invalid") {
        toast.add({
          title: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          timeout: 3000,
        });
      } else {
        window.alert(error.response.data.error);
      }
    } else {
      window.alert("มีบางอย่างผิดพลาด");
    }
  }
  loading.value = false;
};

const handleGoogle = async (idToken: string) => {
  loading.value = true;
  try {
    const res = await google({ idToken });

    if (res.status === 200 && res.data) {
      await authStore.transfer(res.data);
      redirect();
    } else {
      window.alert("มีบางอย่างผิดพลาด");
    }
  } catch (error: any) {
    if (error.response.status) {
      const err = error.response.data.error;
      if (err === "login.invalid") {
        toast.add({
          title: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          timeout: 3000,
        });
      } else if (err === "account.deleted") {
        toast.add({
          title: "บัญชีนี้เพิ่งถูกลบ",
          timeout: 3000,
        });
      } else {
        window.alert(error.response.data.error);
      }
    } else {
      window.alert("มีบางอย่างผิดพลาด");
    }
  }
  loading.value = false;
};

const validate = (state: any): FormError[] => {
  const errors = [];
  if (!state.email) errors.push({ path: "email", message: "อีเมลไม่ถูกต้อง" });
  if (!state.password)
    errors.push({ path: "password", message: "รหัสผ่านไม่ถูกต้อง" });
  return errors;
};

const disabled = computed(() => {
  return !form.email || !form.password;
  //   || !turnstileToken.value;
});

onMounted(() => {
  if (authStore.authenticated) {
    redirect();
  }
});
</script>
<template>
  <Head>
    <title>เข้าสู่ระบบ</title>
  </Head>
  <UContainer class="flex justify-center">
    <UCard class="mt-24 w-11/12 md:w-96">
      <template #header>
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
        >
          เข้าสู่ระบบ
        </h1>
      </template>

      <UForm
        :state="form"
        :validate="validate"
        @submit="handleLogin"
        class="space-y-4"
      >
        <UFormGroup label="อีเมล" name="email">
          <UInput v-model="form.email" type="email" />
        </UFormGroup>

        <UFormGroup label="รหัสผ่าน" name="password">
          <UInput v-model="form.password" type="password" />
        </UFormGroup>

        <div class="flex items-center justify-center">
          <NuxtTurnstile
            v-model="turnstileToken"
            :options="{ theme: 'light' }"
          />
        </div>

        <div class="flex justify-end">
          <UButton
            color="white"
            type="submit"
            :disabled="disabled"
            :loading="loading"
            block
          >
            เข้าสู่ระบบ
          </UButton>
        </div>

        <UDivider label="หรือ" color="gray" />
        <div class="flex justify-center">
          <GoogleSignInButton
            @success="handleLoginSuccess"
            @error="handleLoginError"
            width="100%"
            size="medium"
            text="signin_with"
            logo-alignment="center"
            locale="th"
            ux-mode="popup"
          ></GoogleSignInButton>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between">
          <p class="text-sm font-light text-gray-500">
            ยังไม่มีบัญชีใช่ไหม?
            <ULink
              :to="{
                name: 'register',
              }"
              class="font-medium text-blue-600 hover:underline"
            >
              ลงทะเบียน
            </ULink>
          </p>
          <p class="text-sm font-light text-gray-500">
            <ULink
              :to="{
                name: 'forgot-password',
              }"
              class="font-medium text-blue-600 hover:underline"
            >
              ลืมรหัสผ่านใช่ไหม
            </ULink>
          </p>
        </div>
      </UForm>
    </UCard>
  </UContainer>
</template>
