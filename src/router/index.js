import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectView from '../views/Project.vue'
import LoginView from '../views/Login.vue'
import RenderView from '../views/Render.vue'
import TestView from '../views/test.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/project',
      name: 'project',
      component: ProjectView,
    },
    {
      path: '/render',
      name: 'render',
      component: RenderView,
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
    },
  ],
})

export default router
