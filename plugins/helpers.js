export default defineNuxtPlugin(() => {
  return {
    provide: {
      blurActiveElement: () => document.activeElement?.blur(),
    },
  };
});
