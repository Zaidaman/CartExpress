<script setup>
import { ref, onMounted } from 'vue';

const ordini = ref([]);

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/ordini'); // endpoint backend
    ordini.value = await res.json();
  } catch (err) {
    console.error('Errore nel fetch ordini:', err);
  }
});
</script>

<template>
  <div class="ordini">
    <h1>Lista Ordini</h1>
    <ul v-if="ordini.length">
      <li v-for="ordine in ordini" :key="ordine.id">
        {{ ordine.prodotto }} - Quantità: {{ ordine.quantita }}
      </li>
    </ul>
    <p v-else>Nessun ordine trovato o caricamento in corso...</p>
  </div>
</template>

<style scoped>
.ordini {
  padding: 20px;
  font-family: sans-serif;
}
</style>
