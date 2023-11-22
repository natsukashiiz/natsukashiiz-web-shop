// stores/counter.js
import { defineStore } from "pinia";
import client from "~/api/request";

const store = {
  get: () => localStorage.getItem("token"),
  set: (value: string) => localStorage.setItem("token", value),
  remove: () => localStorage.removeItem("token"),
};

export const useAuthStore = defineStore("auth", () => {
  const token = ref<null | string>(null);
  const isAuth = computed(() => !!token.value);

  const setToken = (value: string) => {
    token.value = value;
    store.set(value);
    loadAuth();
  };

  const removeToken = () => {
    token.value = null;
    store.remove();
  };

  const loadAuth = () => {
    const str = store.get();
    if (str) {
      token.value = str;

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
    } else {
      logout();
    }
  };

  const logout = () => {
    removeToken();
    useRouter().push("/login");
  };

  return {
    token,
    isAuth,
    setToken,
    removeToken,
    loadAuth,
    logout,
  };
});
