import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import OrdiniView from '../views/OrdiniView.vue';
import CategoriaView from '@/views/CategoriaView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/ordini', name: 'ordini', component: OrdiniView },
    { path: '/categoria', name: 'categoria', component: CategoriaView },
    { path: '/carrello', name: 'carrello', component: CarrelloView.vue },
    {path: '/ricerca', name: 'ricerca', component: RicercaView.vue}
  ]
});

export default router;
