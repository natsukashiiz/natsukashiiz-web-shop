import { defineStore } from "pinia";
import type { TokenPayload, TokenResponse } from "~/types";
import client from "~/api/request";
import { refresh } from "~/api/auth";

// const store = {
//   get: () => localStorage.getItem("token"),
//   set: (value: string) => localStorage.setItem("token", value),
//   remove: () => localStorage.removeItem("token"),
// };

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<null | string>(null);
  const refreshToken = ref<null | string>(null);
  const payload = ref<TokenPayload>();
  const authenticated = computed(() => !!accessToken.value);

  const cookieAccessToken = useCookie<string | null>("access_token");
  const cookieRefreshToken = useCookie<string | null>("refresh_token");

  const removeToken = () => {
    accessToken.value = null;
    cookieAccessToken.value = null;
    refreshToken.value = null;
    cookieRefreshToken.value = null;
  };

  const transfer = async (data: TokenResponse) => {
    accessToken.value = data.accessToken;
    cookieAccessToken.value = accessToken.value;
    refreshToken.value = data.refreshToken;
    cookieRefreshToken.value = refreshToken.value;
    await loadAuth();
  };

  const loadAuth = async () => {
    const accessTokenText = cookieAccessToken.value;
    if (accessTokenText) {
      accessToken.value = accessTokenText;

      if (cookieRefreshToken.value) {
        refreshToken.value = cookieRefreshToken.value;
      }

      payload.value = JSON.parse(
        atob(accessTokenText.split(".")[1])
      ) as TokenPayload;

      if (!payload.value) {
        return;
      }

      // check expiration
      if (payload.value.exp < Date.now() / 1000) {
        logout();
        return;
      }

      const timeout = (payload.value.exp - Date.now() / 1000) * 1000 - 10000;

      setTimeout(() => {
        handleRefresh();
      }, timeout);

      client.interceptors.request.use(
        (config) => {
          if (accessToken.value) {
            config.headers.Authorization = `Bearer ${accessToken.value}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      return;
    } else {
      const refreshTokenText = cookieRefreshToken.value;
      if (refreshTokenText) {
        refreshToken.value = refreshTokenText;
        const refreshPayload = JSON.parse(
          atob(refreshTokenText.split(".")[1])
        ) as TokenPayload;
        // check expiration
        if (refreshPayload.exp < Date.now() / 1000) {
          logout();
          return;
        }

        await handleRefresh();
      }
    }
  };

  const handleRefresh = async () => {
    if (!refreshToken.value) {
      logout();
      return;
    }

    try {
      const res = await refresh({
        refreshToken: refreshToken.value,
      });
      if (res.status === 200 && res.data) {
        await transfer(res.data);
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      logout();
    }
  };

  const logout = () => {
    removeToken();
    useRouter().push("/login");
  };

  return {
    accessToken,
    payload,
    authenticated,
    transfer,
    removeToken,
    loadAuth,
    logout,
  };
});
