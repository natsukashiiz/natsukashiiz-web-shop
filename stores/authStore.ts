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

  const cookieAccessToken = useCookie<string | null>("access_token", {
    maxAge: 60 * 60 * 1,
  });
  const cookieRefreshToken = useCookie<string | null>("refresh_token", {
    maxAge: 60 * 60 * 24,
  });

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

  const loadAuth = async (): Promise<boolean> => {
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
        return false;
      }

      const timeout = Math.floor(
        (payload.value.exp - Date.now() / 1000) * 1000 - 10000
      );

      handleTimeout(timeout);

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

      return true;
    } else {
      const refreshTokenText = cookieRefreshToken.value;
      if (refreshTokenText) {
        refreshToken.value = refreshTokenText;
        const refreshPayload = JSON.parse(
          atob(refreshTokenText.split(".")[1])
        ) as TokenPayload;

        // check expiration
        if (refreshPayload.exp < Date.now() / 1000) {
          removeToken();
          return false;
        }

        await handleRefresh();
        return true;
      }
    }
    return false;
  };

  const MAX_TIMEOUT = 2 ** 31 - 1;
  const handleTimeout = (remainingTime: number) => {
    if (remainingTime <= 0) {
      // If no time is remaining or it's negative, immediately try to refresh
      handleRefresh();
    } else if (remainingTime > MAX_TIMEOUT) {
      // If the remaining time exceeds the maximum, set a timeout for the maximum allowed time
      // Then, call handleTimeout again with the reduced remaining time
      setTimeout(() => {
        handleTimeout(remainingTime - MAX_TIMEOUT);
      }, MAX_TIMEOUT);
    } else {
      // If the remaining time is within the allowable range, set a timeout for that duration
      setTimeout(() => {
        handleRefresh();
      }, remainingTime);
    }
  };

  const handleRefresh = async () => {
    if (!refreshToken.value) {
      removeToken();
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
      removeToken();
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
