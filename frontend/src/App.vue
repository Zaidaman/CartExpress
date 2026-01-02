<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function logout() {
  localStorage.removeItem('utente');
  router.push('/login');
}
</script>

<template>
  <div>
    <nav v-if="$route.name !== 'presentazione'">
      <router-link to="/home">Home</router-link> |
      <router-link to="/categoria">Categoria</router-link> |
      <router-link to="/carrello">Carrello</router-link> |
      <router-link to="/ricerca">Ricerca</router-link>
      <button style="margin-left:1rem" @click="logout">Logout</button>
    </nav>
    <hr v-if="$route.name !== 'presentazione'" />

    <router-view />
  </div>
</template>