import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import home from '../components/home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import Addgoods from '../components/goods/Addgoods.vue'
import Orders from '../components/orders/Orders.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    component: home,
    redirect: '/home/welcome',
    children: [
      { path: '/home/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Addgoods },
      { path: '/orders', component: Orders }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // 如果取得地址是login 放行
  if (to.path === '/login') return next()
  // 如果token 没有值 让它去登陆界面 有值就不走这条直接放行
  if (!window.sessionStorage.getItem('token')) return next('/login')

  next()
})
export default router
