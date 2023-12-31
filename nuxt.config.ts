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
  },
  routeRules: {
    "/": { prerender: true },
    "/orders/**": { ssr: false },
    "/payment/**": { ssr: false },
    "/address/**": { ssr: false },
    "/cart/**": { ssr: false },
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
