import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    // name 命名路由
    name: 'login',
    // 路由懒加载， 当页面加载时候会一次性加载所有组件，造成首页留白事件比较久，懒加载就是访问哪个path路径加载哪个组件，能提升加载速度
    component: () => import('@/views/login')
  },
  {
    path: '/',
    redirect: '/home',
    name: 'layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  }
]

const router = new VueRouter({
  routes
})

export default router
