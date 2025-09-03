<script setup>
import { ref } from 'vue';

const idOrdine = ref('');
const ordine = ref(null);
const prodottiOrdine = ref([]);
const errore = ref('');
const loading = ref(false);

async function cercaOrdine() {
  ordine.value = null;
  prodottiOrdine.value = [];
  errore.value = '';

  if (!idOrdine.value) {
    errore.value = 'Inserisci un codice ordine valido.';
    return;
  }

  loading.value = true;

  try {
    const response = await fetch(`http://localhost:3000/api/carrello/getOrdine/${idOrdine.value}`);
    const data = await response.json();

    if (data && data.length > 0) {
      ordine.value = data[0];
      try {
        prodottiOrdine.value = JSON.parse(ordine.value.ListaProdotti);
      } catch {
        prodottiOrdine.value = [];
      }
    } else {
      errore.value = 'Ordine non trovato.';
    }
  } catch {
    errore.value = 'Errore durante la ricerca dell\'ordine.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="ricerca-container">
    <div class="input-container">
      <h2>Ricerca Ordine</h2>
      <input
        v-model="idOrdine"
        type="text"
        placeholder="Inserisci codice ordine"
        @keyup.enter="cercaOrdine"
      />
      <button @click="cercaOrdine">Cerca</button>
    </div>

    <div class="ordine-container" v-if="ordine">
      <h3>Dettagli Ordine</h3>
      <p><strong>ID Ordine:</strong> {{ ordine.IdOrdine }}</p>
      <p><strong>Email:</strong> {{ ordine.Email }}</p>
      <p><strong>Prezzo Totale:</strong> {{ ordine.PrezzoTotale }} €</p>
      <p><strong>Data Ritiro:</strong> {{ ordine.DataRitiro }}</p>
      <p><strong>Data Creazione:</strong> {{ ordine.DataCreazione }}</p>
      <div>
        <strong>Prodotti:</strong>
        <ul>
          <li v-for="(prodotto, idx) in prodottiOrdine" :key="idx">
            {{ prodotto.nome }} -
            {{ prodotto.quantita ? prodotto.quantita + 'x ' : '' }}
            {{ prodotto.prezzo ? prodotto.prezzo + '€' : '' }}
          </li>
        </ul>
      </div>
    </div>

    <div v-if="errore" class="errore">
      <p>{{ errore }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/ricerca.scss" as *;
</style>
