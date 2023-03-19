import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '../views/Index'
import Login from '../views/Login'
import manageRights from '../views/rights/manageRights'
import manageUsers from '../views/users/manageUser'
import manageRole from '../views/roles/manageRole'
import manageDrug from '../views/drug/manageDrug'
import manageBrand from '../views/drug/manageBrand'
import manageDrugDetails from '../views/drug/manageDrugDetails'

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
      }, {
        path: '/drug/manage',
        name: 'manageDrug',
        component: manageDrug
      }, {
        path: '/drug/brand',
        name: 'manageBrand',
        component: manageBrand
      }, {
        path: '/drug/manage/details',
        name: 'manageDrugDetails',
        component: manageDrugDetails
      }

      ]
    }, {
      path: '/login',
      component: Login
    }
  ]
})
