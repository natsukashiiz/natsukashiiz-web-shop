// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  devServer: {
    port: 4200,
  },
  modules: [
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
});
