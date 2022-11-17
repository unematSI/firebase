import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase';
import 'firebase/firestore';

const firbaseURL = "https://app1-985de-default-rtdb.firebaseio.com/"

Vue.prototype.$db = firebase.initializeApp({}).database(firbaseURL).ref('/client');

Vue.prototype.$http = axios;
axios.defaults.baseURL = firbaseURL;

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
