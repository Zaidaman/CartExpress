<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const prodotti = ref([]);
const loading = ref(true);
const errore = ref(null);


onMounted(async () => {
  try {
    // Chiamata all'endpoint che restituisce prodotti di una categoria casuale
    const res = await fetch('http://localhost:3000/api/prodotti/randomCategoria');
    if (!res.ok) throw new Error('Errore nel recupero prodotti');
    const data = await res.json();
    prodotti.value = data.prodotti;
  } catch (e) {
    errore.value = e.message;
  } finally {
    loading.value = false;
  }
});

function vaiAllaCategoria() {
  router.push('/categoria');
}
</script>

<template>
  <div class="view-container">
    <h1>Benvenuto a CartExpress</h1>
    <h2>La tua spesa inizia da qui!</h2>
    <button @click="vaiAllaCategoria">Vai alle Categorie</button>
    <!-- Showcase prodotti -->
    <div class="showcase">
      <h3>Prodotti in vetrina</h3>
      <div v-if="loading">Caricamento...</div>
      <div v-else-if="errore">{{ errore }}</div>
      <div v-else class="prodotti-grid">
        <div v-for="prodotto in prodotti" :key="prodotto.nome" class="prodotto-card">
          <img :src="prodotto.immagine" alt="Immagine prodotto" class="prodotto-img" />
          <div class="prodotto-nome">{{ prodotto.nome }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.showcase {
  margin-top: 2rem;
}
.prodotti-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.prodotto-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 1rem;
  width: 160px;
  text-align: center;
}
.prodotto-img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 0.5rem;
}
.prodotto-nome {
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.prodotto-prezzo {
  color: #2e7d32;
  font-size: 1.1em;
}
</style>