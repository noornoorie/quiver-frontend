import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Workflows from "@/components/Workflows.vue"
import Projects from "@/components/Projects.vue"
import Processors from "@/components/Processors.vue"
import Timeline from "@/components/Timeline.vue"

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        { path: 'projects', name: 'projects', component: Projects },
        { path: 'processors', name: 'processors', component: Processors },
        { path: 'workflows', alias: '/', name: 'workflows', component: Workflows },
        { path: 'timeline', alias: '/', name: 'timeline', component: Timeline },
      ],
    },
  ]
})

export default router
