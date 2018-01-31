import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import MainPage from '@/pages/Main'
import LoginPage from '@/pages/Login'
import NotFound from '@/pages/404'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }, {
      path: '/',
      redirect: '/main'
    }, {
      path: '/login',
      name: 'Login',
      component: LoginPage,
      meta: {
        hasNotLoggedIn: true
      }
    }, {
      path: '/main',
      name: 'MainPage',
      component: MainPage,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('main')
  else next()
})

export default router
