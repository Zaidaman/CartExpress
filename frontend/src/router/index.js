import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import CategoriaView from '@/views/CategoriaView.vue';
import CarrelloView from '../views/CarrelloView.vue';
import RicercaView from '../views/RicercaView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginView },
    { path: '/login', name: 'login-alias', component: LoginView },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/categoria', name: 'categoria', component: CategoriaView },
    { path: '/carrello', name: 'carrello', component: CarrelloView },
    { path: '/ricerca', name: 'ricerca', component: RicercaView }
  ]
});

export default router;