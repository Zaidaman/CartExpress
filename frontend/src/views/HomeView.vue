
<template>
  <div class="view-container">
    <h1>Benvenuto nella Gestione Ordini</h1>
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
