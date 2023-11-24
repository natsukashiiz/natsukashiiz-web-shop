<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { google, login } from "~/api/auth";
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";

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

const form = reactive({
  email: "",
  password: "",
});

const redirect = () => {
  const router = useRouter();
  if (route.query.redirect) {
    router.push(route.query.redirect as string);
  } else {
    router.push("/");
  }
};

const handleLogin = async () => {
  if (disabled.value) return;

  const res = await login(form);

  if (res.status === 200 && res.data) {
    authStore.setToken(res.data.token);
    redirect();
  } else {
    window.alert("Login failed");
  }
};

const handleGoogle = async (idToken: string) => {
  const res = await google({ idToken });

  if (res.status === 200 && res.data) {
    authStore.setToken(res.data.token);
    redirect();
  } else {
    window.alert("Login failed");
  }
};

const disabled = computed(() => {
  return !form.email || !form.password || !turnstileToken.value;
});

onMounted(() => {
  if (authStore.token) {
    redirect();
  }
});
</script>
<template>
  <section>
    <div class="flex flex-col items-center justify-center lg:py-0">
      <div class="w-full bg-white rounded-lg shadow mt-20 sm:max-w-md xl:p-0">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl"
          >
            เข้าสู่ระบบ
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900"
                >อีเมล</label
              >
              <input
                type="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-rose-600 focus:border-rose-600 block w-full p-2.5 :bg-gray-700"
                placeholder="name@company.com"
                v-model="form.email"
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900"
                >รหัสผ่าน</label
              >
              <input
                type="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-rose-600 focus:border-rose-600 block w-full p-2.5"
                v-model="form.password"
              />
            </div>
            <div class="flex items-center justify-center">
              <NuxtTurnstile
                v-model="turnstileToken"
                :options="{ theme: 'light' }"
              />
            </div>
            <UButton color="rose" type="submit" :disabled="disabled" block>
              เข้าสู่ระบบ
            </UButton>
            <UDivider label="หรือ" color="gray" />
            <div class="px-6 sm:px-0 max-w-sm">
              <GoogleSignInButton
                @success="handleLoginSuccess"
                @error="handleLoginError"
                width="385"
                size="medium"
                text="เข้าสู่ระบบด้วย Google"
              ></GoogleSignInButton>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-sm font-light text-gray-500">
                ยังไม่มีบัญชีใช่ไหม?
                <a href="#" class="font-medium text-rose-600 hover:underline"
                  >ลงทะเบียน</a
                >
              </p>
              <p class="text-sm font-light text-gray-500">
                <a
                  href="#"
                  class="text-sm font-medium text-rose-600 hover:underline"
                  >ลืมรหัสผ่านใช่ไหม?</a
                >
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
