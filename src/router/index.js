import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProgressView from '../views/ProgressView.vue'
import RecommendationsView from '../views/RecommendationsView.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  linkActiveClass: "active-link",
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/progress',
      name: 'progress',
      component: ProgressView
    },
    {
      path: '/meals',
      name: 'meals',
      component: RecommendationsView
    }
  ]
})

export default router
