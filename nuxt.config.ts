// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    port: 4200,
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "nuxt-icon",
    "@nuxtjs/device",
    "nuxt-vue3-google-signin",
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
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL,
    },
  },
  app: {
    baseURL: process.env.WEB_BASE_URL || "/",
    pageTransition: { name: "page", mode: "out-in" },
  },
  ui: {
    notifications: {
      // Show toasts at the top right of the screen
      position: "top-0 bottom-auto",
    },
  },
  googleSignIn: {
    clientId:
      "213921102049-buchqc6diom118vnsidm9fito3cr51dd.apps.googleusercontent.com",
  },
});
