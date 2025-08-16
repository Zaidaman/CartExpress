<script setup>
import { ref, onMounted } from 'vue';

const categorie = ref([]);
const prodotti = ref([]);
const categoriaSelezionata = ref(null);

// Carica tutte le categorie all'avvio
onMounted(async () => {
	try {
		const res = await fetch('http://localhost:3000/api/testCategorie');
		categorie.value = await res.json();
	} catch (err) {
		console.error('Errore nel fetch categorie:', err);
	}
});

// Carica prodotti per categoria
async function caricaProdotti(idCategoria) {
	categoriaSelezionata.value = idCategoria;
	try {
		const res = await fetch(`http://localhost:3000/api/prodotti/categoria/${idCategoria}`);
		prodotti.value = await res.json();
	} catch (err) {
		console.error('Errore nel fetch prodotti:', err);
		prodotti.value = [];
	}
}
</script>

<template>
	<div class="layout">
		<aside class="sidebar">
			<h2>Categorie</h2>
			<ul v-if="categorie.length">
				<li v-for="cat in categorie" :key="cat.IdCategoria">
					<button @click="caricaProdotti(cat.IdCategoria)">
						<img :src="`/${cat.Immagine}`" alt="" />
						<span>{{ cat.Nome }}</span>
					</button>
				</li>
			</ul>
			<p v-else>Caricamento categorie...</p>
		</aside>


		<main class="content">
			<div v-if="!categoriaSelezionata" class="placeholder">
				<p>Seleziona una categoria per vedere i prodotti</p>
			</div>

			<div v-else>
				<h2>Prodotti</h2>
				<ul v-if="prodotti.length">
					<li v-for="prod in prodotti" :key="prod.IdProdotto">
						<img :src="`/${prod.Immagine}`" alt="" />
						{{ prod.Nome }} - Prezzo: {{ prod.Prezzo }} €
					</li>
				</ul>
				<p v-else>Nessun prodotto trovato per questa categoria.</p>
			</div>
		</main>
	</div>
</template>

<style scoped>
.view-container {
	display: flex;              /* affianca le due colonne */
	gap: 20px;                  /* spazio tra le box */
	padding: 20px;
}

.view-container-categorie {
	flex: 1;                    /* occupa metà spazio */
	background-color: #f0f8ff;  /* colore diverso */
	padding: 20px;
	border-radius: 8px;
}

.view-container-prodotti {
	flex: 2;                    /* più spazio ai prodotti */
	background-color: #fff8dc;  /* colore diverso */
	padding: 20px;
	border-radius: 8px;
}

button {
	margin: 5px 0;
	padding: 8px 15px;
	background: #42b983;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}
button:hover {
	background: #369f6e;
}
</style>
