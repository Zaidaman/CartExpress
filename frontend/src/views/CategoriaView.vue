
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
	<div class="view-container">
		<h1>Seleziona una Categoria</h1>
		<ul v-if="categorie.length">
			<li v-for="cat in categorie" :key="cat.IdCategoria">
				<button @click="caricaProdotti(cat.IdCategoria)">
					{{ cat.NomeCategoria }}
				</button>
			</li>
		</ul>
		<p v-else>Caricamento categorie...</p>

		<div v-if="categoriaSelezionata">
			<h2>Prodotti della categoria</h2>
			<ul v-if="prodotti.length">
				<li v-for="prod in prodotti" :key="prod.IdProdotto">
					{{ prod.NomeProdotto }} - Prezzo: {{ prod.Prezzo }} €
				</li>
			</ul>
			<p v-else>Nessun prodotto trovato per questa categoria.</p>
		</div>
	</div>
</template>

<style scoped>
.categorie {
	padding: 20px;
	font-family: sans-serif;
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
