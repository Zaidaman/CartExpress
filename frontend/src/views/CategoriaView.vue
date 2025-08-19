<script setup>
import { ref, onMounted } from 'vue';

const categorie = ref([]);
const prodotti = ref([]);
const quantitaProdotti = ref({});
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
		// Reset quantità per i nuovi prodotti e imposta default a 1
		console.log('Prodotti ricevuti:', prodotti.value);
		// Reset quantità per i nuovi prodotti
		quantitaProdotti.value = {};
		prodotti.value.forEach(prod => {
			quantitaProdotti.value[prod.Nome] = 1;
		});
	} catch (err) {
		console.error('Errore nel fetch prodotti:', err);
		prodotti.value = [];
		quantitaProdotti.value = {};
	}
}

function aggiornaQuantita(nomeProdotto, valore) {
	quantitaProdotti.value = {
		...quantitaProdotti.value,
		[nomeProdotto]: valore
	};
}

function salvaInCookie(prodotto) {
	const quantita = quantitaProdotti.value[prodotto.Nome] || '';
	if (!quantita || isNaN(quantita) || quantita <= 0) {
		alert('Inserisci una quantità valida per il prodotto.');
		return;
	}
	// Crea oggetto da salvare
	const item = {
		nome: prodotto.nome,
		prezzo: prodotto.prezzo,
		quantita: Number(quantita)
	};
	// Recupera cookie esistente
	let carrello = [];
	const cookie = document.cookie.split('; ').find(row => row.startsWith('carrello='));
	if (cookie) {
		try {
			carrello = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
		} catch {}
	}
	// Aggiorna o aggiungi prodotto (usando nome come chiave)
	const idx = carrello.findIndex(p => p.nome === item.nome);
	if (idx !== -1) {
		carrello[idx].quantita = item.quantita;
	} else {
		carrello.push(item);
	}
	// Salva cookie (scadenza 7 giorni)
	document.cookie = `carrello=${encodeURIComponent(JSON.stringify(carrello))}; path=/; max-age=${604800}`;
	// Reset quantità a 1 dopo il salvataggio
	quantitaProdotti.value[prodotto.Nome] = 1;
	alert('Prodotto salvato nel carrello!');
}
</script>

<template>
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
					<li v-for="prod in prodotti" :key="prod.nome" class="prodotto-item">
						<img :src="`/${prod.immagine}`" alt="" />
						{{ prod.Nome }} - Prezzo: {{ prod.Prezzo }} €
						<div class="info-prodotto">
							<span class="nome-prodotto">{{ prod.nome }}</span>
							<span class="prezzo-prodotto">Prezzo: {{ prod.prezzo }} €</span>
							<input
								type="number"
								min="1"
								:placeholder="'Quantità'"
								v-model="quantitaProdotti[prod.nome]"
								@input="aggiornaQuantita(prod.nome, quantitaProdotti[prod.nome])"
								class="input-quantita"
							/>
							<button @click="salvaInCookie(prod)" class="btn-salva">Salva</button>
						</div>
					</li>
				</ul>
				<p v-else>Nessun prodotto trovato per questa categoria.</p>
			</div>
		</div>
	</div>
</template>


<style lang="scss" scoped>
@import '../styles/categoria.scss';
</style>
