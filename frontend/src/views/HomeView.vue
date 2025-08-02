<template>
  <div class="home">
    <h1>Benvenuto nella Gestione Ordini</h1>
    <p>Questa è la pagina iniziale con informazioni generiche.</p>
    <button @click="vaiAiOrdini">Vai agli Ordini</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const vaiAiOrdini = () => {
  router.push('/ordini'); // Naviga alla pagina Ordini
};
</script>

<style scoped>
.home {
  padding: 20px;
  font-family: sans-serif;
}
button {
  padding: 10px 15px;
  background: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background: #369f6e;
}
</style>
