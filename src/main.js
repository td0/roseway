// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './fbHelper'
import Vue from 'vue'
import VueFire from 'vuefire'
import VueMaterial from 'vue-material'
import * as VueGMaps from 'vue2-google-maps'
import firebase from 'firebase'
import App from './App'
import router from './router/router'
import {mapsKey} from '../keystore'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false
Vue.use(VueFire)
Vue.use(VueMaterial)
Vue.use(VueGMaps, {
  load: {
    key: mapsKey
    // v: '3.exp',
    // use_slippy: true
  }
})

let app
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})
