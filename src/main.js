import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase';
import 'firebase/firestore';

const fb = firebase.initializeApp({
  apiKey: "AIzaSyDq3bhtz0x4-sJh9sW3WeT-rvyytEJGd4Q",
  authDomain: "app1-985de.firebaseapp.com",
  databaseURL: "https://app1-985de-default-rtdb.firebaseio.com",
  projectId: "app1-985de",
  storageBucket: "app1-985de.appspot.com",
  messagingSenderId: "1068296984786",
  appId: "1:1068296984786:web:781f1c3bd9e5424a87b50b"
});

const db = fb.database().ref('/client');
const auth = fb.auth()

Vue.prototype.$firebase = fb
Vue.prototype.$db = db
Vue.prototype.$auth = auth

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

export {fb, db, auth};
