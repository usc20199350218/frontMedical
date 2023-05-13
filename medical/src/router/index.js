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
import offlineSales from '../views/store/offlineSales'
import mode from '../views/mode'
import offlineOrderDetails from '../views/store/offlineOrderDetails'
import paytest from '../views/test/paytest'
import pay from '../views/pay/pay'
import onlineStore from '../views/online/onlineStore'
import onlineIndex from '../views/online/onlineIndex'
import onlineSearch from '../views/online/onlineSearch'
import shoppingCart from '../views/online/shoppingCart'
import confirm from '../views/online/confirm'
import userOrder from '../views/online/userOrder'
import storeOrder from '../views/order/storeOrder'
import nothing from '../views/nothing'
import serviceUser from '../views/service/serviceUser'
import serviceDetail from '../views/service/detail'
import serviceManage from '../views/service/manage'
import serviceChoose from '../views/service/choose'
import newService from '../views/service/newService'
import welcome from '../views/welcome'
import manageAddress from '../views/address/manageAddress'
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
      redirect: '/welcome',
      children: [
        {
          path: '/nothing',
          name: 'nothing',
          component: nothing
        }, {
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
        }, {
          path: '/store/offline',
          name: 'offlineSales',
          component: offlineSales
        }, {
          path: '/mode',
          name: 'mode',
          component: mode
        }, {
          path: '/store/offline/order/details',
          name: 'offlineOrderDetails',
          component: offlineOrderDetails
        }, {
          path: '/pay/test',
          name: 'paytest',
          component: paytest
        }, {
          path: '/pay/pay',
          name: 'pay',
          component: pay
        }, {
          path: '/online/store',
          name: 'onlineStore',
          component: onlineStore
        }, {
          path: '/online/search',
          name: 'onlineSearch',
          component: onlineSearch
        }, {
          path: '/online/index',
          name: 'onlineIndex',
          component: onlineIndex
        }, {
          path: '/online/shoppingcart',
          name: 'shoppingCart',
          component: shoppingCart
        }, {
          path: '/online/confirm',
          name: 'confirm',
          component: confirm
        }, {
          path: '/user/order',
          name: 'userOrder',
          component: userOrder
        }, {
          path: '/store/order',
          name: 'storeOrder',
          component: storeOrder
        }, {
          path: '/service/user',
          name: 'serviceUser',
          component: serviceUser
        }, {
          path: '/service/detail',
          name: 'serviceDetail',
          component: serviceDetail
        }, {
          path: '/service/manage',
          name: 'serviceManage',
          component: serviceManage
        }, {
          path: '/service/choose',
          name: 'serviceChoose',
          component: serviceChoose
        }, {
          path: '/service/add',
          name: 'newService',
          component: newService
        }, {
          path: '/welcome',
          name: 'welcome',
          component: welcome
        }, {
          path: '/address/manage',
          name: 'manageAddress',
          component: manageAddress
        }

      ]
    }, {
      path: '/login',
      component: Login
    }, {
      path: '*',
      redirect: '/nothing'
    }
  ]
})
