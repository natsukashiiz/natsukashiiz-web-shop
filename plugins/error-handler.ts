export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.log("VueErrorHandler-Error", error);
    console.log("VueErrorHandler-Instance", instance);
    console.log("VueErrorHandler-Info", info);
  };

  nuxtApp.hook("vue:error", (error, instance, info) => {
    console.log("VueErrorHandler-Error", error);
    console.log("VueErrorHandler-Instance", instance);
    console.log("VueErrorHandler-Info", info);
  });
});
