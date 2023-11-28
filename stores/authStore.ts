import { defineStore } from "pinia";
import client from "~/api/request";
import type { TokenPayload } from "~/types";

// const store = {
//   get: () => localStorage.getItem("token"),
//   set: (value: string) => localStorage.setItem("token", value),
//   remove: () => localStorage.removeItem("token"),
// };

export const useAuthStore = defineStore("auth", () => {
  const token = ref<null | string>(null);
  const payload = ref<TokenPayload>();
  const isAuth = computed(() => !!token.value);

  const cookie = useCookie<string | null>("token");

  const setToken = (value: string) => {
    token.value = value;
    cookie.value = value;
    loadAuth();
  };

  const removeToken = () => {
    token.value = null;
    cookie.value = null;
  };

  const loadAuth = (): boolean => {
    const str = cookie.value;
    if (str) {
      token.value = str;

      payload.value = JSON.parse(atob(str.split(".")[1]));

      // check expiration
      if (payload.value && payload.value.exp < Date.now() / 1000) {
        return false;
      }

      client.interceptors.request.use(
        (config) => {
          if (token.value) {
            config.headers.Authorization = `Bearer ${token.value}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    removeToken();
    useRouter().push("/login");
  };

  return {
    token,
    payload,
    isAuth,
    setToken,
    removeToken,
    loadAuth,
    logout,
  };
});
