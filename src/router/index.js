import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'

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
    { path: '/home', name: 'Home', component: Home }
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
