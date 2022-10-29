import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueLoading);
});
