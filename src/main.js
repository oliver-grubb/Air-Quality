import Vue from 'vue'
import App from './App.vue'
import axios from "axios";

Vue.config.productionTip = false

Vue.prototype.$http = axios.create({
  baseURL: 'https://api.openaq.org/v1/',
  timeout: 10000,
  headers: {
    'Accept' : 'foobar'
  }
});

new Vue({
  render: h => h(App),
}).$mount('#app')
