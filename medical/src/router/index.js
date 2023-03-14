import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '../views/Index'
import Login from '../views/Login'
import manageRights from '../views/rights/manageRights'
import manageUsers from '../views/users/manageUser'
import manageRole from '../views/roles/manageRole'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      // redirect: '/movie/findall',
      children: [{
        path: '/rights/manage',
        name: 'manageRights',
        component: manageRights
      }, {
        path: '/users/manage',
        name: 'manageUsers',
        component: manageUsers
      }, {
        path: '/role/manage',
        name: 'manageRole',
        component: manageRole
      }

      ]
    }, {
      path: '/login',
      component: Login
    }
  ]
})