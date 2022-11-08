import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueLoading);
});
