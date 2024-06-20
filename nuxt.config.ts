// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    port: 4200,
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "nuxt-icon",
    "@nuxtjs/device",
    "nuxt-vue3-google-signin",
    "nuxt-typed-router",
    "@stefanobartoletti/nuxt-social-share",
    "@nuxtjs/turnstile",
    "@nuxt/image",
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
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
    },
  },
  app: {
    baseURL: process.env.WEB_BASE_URL || "/",
    head: {
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        },
      ],
    },
  },
  routeRules: {
    "/": { prerender: true },
    "/orders/**": { ssr: false },
    "/payment/**": { ssr: false },
    "/cart/**": { ssr: false },
    "/login/**": { ssr: false },
    "/register/**": { ssr: false },
    "/forgot-password/**": { ssr: false },
    "/reset-password/**": { ssr: false },
    "/verification/**": { ssr: false },
    "/vouchers/**": { ssr: false },
    "/profile/**": { ssr: false },
  },
  colorMode: {
    preference: "light",
  },
  googleSignIn: {
    clientId:
      "213921102049-buchqc6diom118vnsidm9fito3cr51dd.apps.googleusercontent.com",
  },
  turnstile: {
    siteKey: "1x00000000000000000000BB",
  },
});
