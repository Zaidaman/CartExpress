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
      <p><strong>ID Ordine:</strong> {{ ordine.idOrdine }}</p>
      <p><strong>Email:</strong> {{ ordine.email }}</p>
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

<style scoped>
.ricerca-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
}
.input-container {
  background: #f5f5f5;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input-container input {
  margin: 12px 0;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.input-container button {
  padding: 8px 18px;
  border: none;
  border-radius: 6px;
  background: #2d8cf0;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.input-container button:hover {
  background: #1a6fb3;
}
.ordine-container {
  background: #fff;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  min-width: 320px;
}
.errore {
  color: #d32f2f;
  margin-top: 16px;
}
</style>
