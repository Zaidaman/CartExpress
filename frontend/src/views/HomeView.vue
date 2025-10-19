<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const prodotti = ref([]);
const loading = ref(true);
const errore = ref(null);
const utente = ref(null); // 👈 Aggiunto per gestire l'utente

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

  // 👇 Recupero utente da localStorage
  const utenteSalvato = localStorage.getItem('utente');
  if (utenteSalvato) {
    try {
      utente.value = JSON.parse(utenteSalvato);
    } catch {
      utente.value = null;
    }
  }
});

function vaiAllaCategoria() {
  router.push('/categoria');
}
</script>

<template>
  <div class="view-container">
    <h1>
      Benvenuto a CartExpress,
      <span v-if="utente && utente.Username">
        {{ utente.Username }}
      </span>!
    </h1>

    <h2>La tua spesa inizia da qui!</h2>

    <button @click="vaiAllaCategoria">Vai alle Categorie</button>
  </div>

  <div class="showcase">
      <h3>Prodotti in vetrina</h3>
      <div v-if="loading">Caricamento...</div>
      <div v-else-if="errore">{{ errore }}</div>
      <div v-else class="prodotti-scroll">
        <div v-for="prodotto in prodotti" :key="prodotto.nome" class="prodotto-card">
          <img :src="prodotto.immagine" alt="Immagine prodotto" class="prodotto-img" />
          <div class="prodotto-nome">{{ prodotto.nome }}</div>
        </div>
      </div>
    </div>
</template>

<style scoped>
.showcase {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem 1.5rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  text-align: center;
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
.prodotti-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto; /* abilita lo scroll orizzontale */
  padding-bottom: 1rem;
  scroll-behavior: smooth; /* scorrimento fluido */
}

.prodotti-scroll::-webkit-scrollbar {
  height: 8px;
}

.prodotti-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.prodotto-card {
  flex: 0 0 auto; /* evita che si ridimensionino */
  width: 160px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 1rem;
  text-align: center;
}
</style>
