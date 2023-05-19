import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import App from './components/Client/App.vue'
import router from './router'

import './assets/main.css'
import vuetify from './plugins/vuetify'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import '../src/assets/base.css'

export const bus = new Vue();

Vue.use(VueSweetalert2);

new Vue({
  router,
  vuetify,
  render: (h) => h(App)
}).$mount('#app')