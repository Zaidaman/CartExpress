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
      <p><strong>Data Creazione:</strong> {{ ordine.DataCreazione }}</p>
      <div>
        <strong>Prodotti:</strong>
        <ul>
          <li v-for="(prodotto, idx) in prodottiOrdine" :key="idx">
            {{ prodotto.nome }} - {{ prodotto.quantita ? prodotto.quantita + 'x ' : '' }}{{ prodotto.prezzo ? prodotto.prezzo + '€' : '' }}
          </li>
        </ul>
      </div>
    </div>
    <div v-if="errore" class="errore">
      <p>{{ errore }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RicercaView",
  data() {
    return {
      idOrdine: '',
      ordine: null,
      prodottiOrdine: [],
      errore: ''
    };
  },
  methods: {
    async cercaOrdine() {
      this.ordine = null;
      this.prodottiOrdine = [];
      this.errore = '';
      if (!this.idOrdine) {
        this.errore = 'Inserisci un codice ordine valido.';
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/carrello/getOrdine/${this.idOrdine}`);
        const data = await response.json();
        if (data && data.length > 0) {
          this.ordine = data[0];
          try {
            this.prodottiOrdine = JSON.parse(this.ordine.ListaProdotti);
          } catch (e) {
            this.prodottiOrdine = [];
          }
        } else {
          this.errore = 'Ordine non trovato.';
        }
      } catch (err) {
        this.errore = 'Errore durante la ricerca dell\'ordine.';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@use "../styles/search.scss" as *;
</style>
