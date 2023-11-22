<script setup lang="ts">
import { useAuthStore } from "~/stores/authStore";
import { google, login } from "~/api/auth";
import {
  type CredentialResponse,
  type ImplicitFlowErrorResponse,
} from "vue3-google-signin";
import { getGoogleOauthToken } from "~/api/google";

const handleOnSuccess = async (response: CredentialResponse) => {
  // send code to a backend server to verify it.
  console.log("response: ", response);

  // use axios or something to reach backend server
  //   await handleGoogle(response.clientId as string);
};

const handleOnError = (errorResponse: ImplicitFlowErrorResponse) => {
  console.log("Error: ", errorResponse);
};

const client = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
  scope: "profile email openid",
});

const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
});

const handleLogin = async (e: MouseEvent) => {
  e.preventDefault();
  const res = await login(form);

  if (res.status === 200 && res.data) {
    authStore.setToken(res.data.token);
    const router = useRouter();
    router.push("/");
  } else {
    window.alert("Login failed");
  }
};

const handleGoogle = async (idToken: string) => {
  const res = await google({ idToken });

  if (res.status === 200 && res.data) {
    authStore.setToken(res.data.token);
    const router = useRouter();
    router.push("/");
  } else {
    window.alert("Login failed");
  }
};

const getGoogleUrl = (from: string) => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options = {
    redirect_uri: "http://localhost:4200",
    client_id:
      "708294166920-f8h11nj3qp5hssd90uipe6r94i6mm96j.apps.googleusercontent.com",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    state: from,
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};

onMounted(async () => {
  console.log(await getGoogleOauthToken({ code: "code" }));
});
</script>
<template>
  <section class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="flex flex-col items-center justify-center lg:py-0">
      <div
        class="w-full bg-white rounded-lg shadow dark:border mt-32 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            เข้าสู่ระบบ
          </h1>
          <form class="space-y-4 md:space-y-6" action="#" @submit="handleLogin">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >อีเมล</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-rose-600 focus:border-rose-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                v-model="form.email"
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >รหัสผ่าน</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-rose-600 focus:border-rose-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                v-model="form.password"
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-start"></div>
              <a
                href="#"
                class="text-sm font-medium text-rose-600 hover:underline dark:text-rose-500"
                >ลืมรหัสผ่านใช่ไหม?</a
              >
            </div>
            <button
              type="submit"
              class="w-full text-white bg-rose-400 hover:bg-rose-500 focus:ring-2 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800"
            >
              เข้าสู่ระบบ
            </button>
            <div class="relative flex items-center">
              <div class="flex-grow border-t border-gray-400"></div>
              <span class="flex-shrink mx-4 text-gray-400">หรือ</span>
              <div class="flex-grow border-t border-gray-400"></div>
            </div>
            <div class="px-6 sm:px-0 max-w-sm">
              <button
                type="button"
                class="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
                :disabled="!client.isReady"
                @click="() => client.login()"
              >
                <svg
                  class="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                เข้าสู่ระบบด้วย Google
                <div></div>
              </button>
            </div>

            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              ยังไม่มีบัญชีใช่ไหม?
              <a
                href="#"
                class="font-medium text-rose-600 hover:underline dark:text-rose-500"
                >ลงทะเบียน</a
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
