export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.config.errorHandler = (err, context) => {
    console.error('error-handler plugin', err);
  };
});
