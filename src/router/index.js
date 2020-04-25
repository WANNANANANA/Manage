import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Categories from '../components/goods/Categories'
import Params from '../components/goods/Params'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/login' }, // 路由重定向
    { path: '/login', name: 'Login', component: Login },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', name: 'Welcome', component: Welcome },
        { path: '/users', name: 'Users', component: Users },
        { path: '/rights', name: 'Rights', component: Rights },
        { path: '/roles', name: 'Roles', component: Roles },
        { path: '/categories', name: 'Categories', component: Categories },
        { path: '/params', name: 'Params', component: Params },
        { path: '/goods', name: 'List', component: List },
        { path: '/goods/add', name: 'Add', component: Add },
        { path: '/orders', name: 'Order', component: Order }
      ]
    }
  ]
})

// 路由导航守卫
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token');
  if (to.path == '/login') {
    if (token) {
      next('/home');
    } else {
      next();
    }
  } else {
    if (token) {
      next();
    } else {
      next('/login');
    }
  }
})

export default router
