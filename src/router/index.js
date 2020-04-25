import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/login' }, // 路由重定向
    { path: '/login', name: 'Login', component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Login') },
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Home'),
      redirect: '/welcome',
      children: [
        { path: '/welcome', name: 'Welcome', component: () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome') }, 
        { path: '/users', name: 'Users', component: () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/users/Users') },
        { path: '/rights', name: 'Rights',  component: () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights') },
        { path: '/roles', name: 'Roles',  component: () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles') },
        { path: '/categories', name: 'Categories', component: () => import(/* webpackChunkName: "Categories_Params" */ '../components/goods/Categories') },
        { path: '/params', name: 'Params', component: () => import(/* webpackChunkName: "Categories_Params" */ '../components/goods/Params') },
        { path: '/goods', name: 'List', component: () => import(/* webpackChunkName: "List_Add"" */ '../components/goods/List') },
        { path: '/goods/add', name: 'Add', component: () => import(/* webpackChunkName: "List_Add"" */ '../components/goods/Add') },
        { path: '/orders', name: 'Order', component: () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order') },
        { path: '/reports', name: 'Report', component: () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report') },
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
