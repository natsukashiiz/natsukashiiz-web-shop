// import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("page:start", () => {
    // console.log("Page start...");
  });
  nuxtApp.hook("page:finish", () => {
    // console.log("Page finished!");
  });
});
