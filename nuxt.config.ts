// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    port: 4200,
  },
  runtimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL,
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "nuxt-icon",
    "@nuxtjs/device",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Roboto: true,
          Mitr: {
            wght: [100, 300],
            ital: [100],
          },
        },
      },
    ],
  ],
  ui: {
    notifications: {
      // Show toasts at the top right of the screen
      position: "top-0 bottom-auto",
    },
  },
});
