// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase'
import App from './App'
import router from './router/router'
import fbConfig from '../keystore'

import 'bootstrap/dist/css/bootstrap.css'
import 'mdbootstrap/css/mdb.css'
import './components/Waves.css'

Vue.config.productionTip = false

firebase.initializeApp(fbConfig)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
