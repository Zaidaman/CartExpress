<script setup>
import { ref, onMounted } from 'vue';

const ordini = ref([]);

onMounted(async () => {
  try {
    // Sostituisci con l'endpoint reale quando disponibile
    const res = await fetch('http://localhost:3000/api/ordini');
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
        <strong>{{ ordine.prodotto }}</strong>
        <span v-if="ordine.categoria"> (Categoria: {{ ordine.categoria }})</span>
        - Quantità: {{ ordine.quantita }}
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
