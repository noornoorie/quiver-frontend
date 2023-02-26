import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Workflows from "@/components/Workflows.vue";
import Projects from "@/components/Projects.vue";
import Processors from "@/components/Processors.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        { path: 'projects', name: 'projects', component: Projects },
        { path: 'processors', name: 'processors', component: Processors },
        { path: 'workflows', alias: '/', name: 'workflows', component: Workflows },
      ],
    },
  ]
});

export default router;
