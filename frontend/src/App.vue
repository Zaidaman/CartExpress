<script setup>
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

function logout() {
  localStorage.removeItem('utente');
  router.push('/login');
}
</script>

<template>
  <div>
    <nav v-if="route.name !== 'login' && route.name !== 'login-alias'">
      <router-link to="/home">Home</router-link> |
      <router-link to="/categoria">Categoria</router-link> |
      <router-link to="/carrello">Carrello</router-link> |
      <router-link to="/ricerca">Ricerca</router-link>
      <button style="margin-left:1rem" @click="logout">Logout</button>
    </nav>
    <hr v-if="route.name !== 'login' && route.name !== 'login-alias'" />

    <router-view />
  </div>
</template>