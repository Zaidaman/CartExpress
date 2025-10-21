<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const router = useRouter();
const prodotti = ref([]);
const loading = ref(true);
const errore = ref(null);
const utente = ref(null); // 👈 Aggiunto per gestire l'utente
const prodottiScrollRef = ref(null);
let scrollInterval = null;

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

  // 👇 Avvia lo scroll automatico
    scrollInterval = setInterval(() => {
      const el = prodottiScrollRef.value;
      if (el && el.scrollWidth > el.clientWidth) {  
        // Aumenta la velocità (da 2 a 8 pixel per tick)
        const scrollStep = 8;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - scrollStep) {
          // Reset completo all'inizio (istantaneo)
          el.scrollLeft = 0;
        } else {
          el.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
      }
    }, 30);
});

onUnmounted(() => {
  if (scrollInterval) clearInterval(scrollInterval);
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
      <div v-else class="prodotti-scroll" ref="prodottiScrollRef">
        <div v-for="prodotto in prodotti" :key="prodotto.nome" class="prodotto-card">
          <img :src="prodotto.immagine" alt="Immagine prodotto" class="prodotto-img" />
          <div class="prodotto-nome">{{ prodotto.nome }}</div>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../styles/home.scss' as *;
.prodotti-scroll {
  transition: scroll-left 0.3s;
}
</style>
