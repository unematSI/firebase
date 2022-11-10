import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

Vue.prototype.$http = axios;
axios.defaults.baseURL = "https://app1-985de-default-rtdb.firebaseio.com/";

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
