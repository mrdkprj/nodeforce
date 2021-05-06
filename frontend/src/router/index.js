import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Main from '@/components/main'
import Store from "@/store/index.js"

Vue.use(Router)

const router = new Router({
  //mode: "history",
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      meta: {
        isPublic: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        isPublic: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(page => page.meta.isPublic) || Store.state.auth.token) {
    console.log("next")
    console.log(to)
    next()
  } else {
    console.log("next login")
    next('/login')
  }
})

export default router
