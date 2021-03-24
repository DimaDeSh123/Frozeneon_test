import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue } from 'bootstrap-vue'
import VueRouter from 'vue-router'
import vmodal from 'vue-js-modal'


import './assets/css/main.scss';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(vmodal);
Vue.use(BootstrapVue);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
