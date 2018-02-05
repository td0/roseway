import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import MainPage from '@/pages/Main'
import LoginPage from '@/pages/Login'
import ReportsPage from '@/pages/Reports'
import FixedRoadPage from '@/pages/FixedRoad'
import AbusePage from '@/pages/Abuse'
import UsersPage from '@/pages/Users'
import NotFound from '@/pages/404'
import TestPage from '@/pages/Test'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    }, {
      path: '/',
      component: MainPage,
      children: [
        {
          path: 'reports',
          name: 'Reports',
          component: ReportsPage
        }, {
          path: 'fixed-issues',
          name: 'FixedRoad',
          component: FixedRoadPage
        }, {
          path: 'abuse-issues',
          name: 'Abuse',
          component: AbusePage
        }, {
          path: 'users',
          name: 'Users',
          component: UsersPage
        }
      ],
      meta: {
        requiresAuth: true
      },
      redirect: '/reports'
    }, {
      path: '/login',
      name: 'Login',
      component: LoginPage
    }, {
      path: '/test',
      name: 'Test',
      component: TestPage
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else next()
})

export default router
