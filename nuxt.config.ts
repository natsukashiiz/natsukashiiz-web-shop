// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    "@vite-pwa/nuxt",
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
  plugins: [{ src: "~/plugins/vue-cropperjs.ts", mode: "client" }],
  devtools: { enabled: true },
  devServer: {
    port: 4500,
  },
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
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "icons/favicon.ico",
        },
      ],
    },
  },
  routeRules: {
    "/": { ssr: true },
    "/orders/**": { ssr: false },
    "/payment/**": { ssr: false },
    "/cart/**": { ssr: false },
    "/login/**": { prerender: true },
    "/register/**": { prerender: true },
    "/forgot-password/**": { prerender: true },
    "/reset-password/**": { prerender: true },
    "/verification/**": { prerender: true },
    "/vouchers/**": { ssr: true },
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
  pwa: {
    manifest: {
      name: "NATSUKASHIIZ",
      short_name: "N",
      description: "natsukashiiz shop for develop only",
      theme_color: "#ffffff",
      icons: [
        {
          src: "icons/icon_64x64.png",
          sizes: "64x64",
          type: "image/png",
        },
        {
          src: "icons/icon_144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "icons/icon_192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/icon_512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
