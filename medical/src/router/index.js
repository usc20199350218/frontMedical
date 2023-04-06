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
import purchase from '../views/storehouse/purchase'
import manageStore from '../views/store/manageStore'
import managePosition from '../views/store/managePosition'
import manageStaff from '../views/store/manageStaff'
import manageStoreBatch from '../views/store/manageStoreBatch'
import manageType from '../views/drug/manageType'
import manageApply from '../views/storehouse/manageApply'
import storeDelivery from '../views/delivery/storeDelivery'
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
      }, {
        path: '/storehouse/purchase',
        name: 'purchase',
        component: purchase
      },
      {
        path: '/store/manage',
        name: 'manageStore',
        component: manageStore
      },
      {
        path: '/store/position',
        name: 'managePosition',
        component: managePosition
      }, {
        path: '/store/staff',
        name: 'manageStaff',
        component: manageStaff
      }, {
        path: '/store/batch',
        name: 'manageStoreBatch',
        component: manageStoreBatch
      }, {
        path: '/drug/type',
        name: 'manageType',
        component: manageType
      }, {
        path: '/storehouse/store_apply',
        name: 'manageApply',
        component: manageApply
      }, {
        path: '/delivery/store',
        name: 'storeDelivery',
        component: storeDelivery
      }

      ]
    }, {
      path: '/login',
      component: Login
    }
  ]
})
