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
		<div class="categorie-prodotti-wrapper">
			<div class="categorie-container">
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
			</div>

			<div class="prodotti-container">
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
			</div>
		</div>
	</div>
</template>
