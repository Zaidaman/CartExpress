<script setup>
import { ref, onMounted } from 'vue';

const carrello = ref([]);
const totale = ref(0);

const totaleProdotti = ref(0);
const email = ref("");

function calcolaTotaleProdotti() {
	totaleProdotti.value = carrello.value.reduce((acc, prod) => acc + prod.quantita, 0);
}

function leggiCarrelloDaCookie() {
	const cookie = document.cookie.split('; ').find(row => row.startsWith('carrello='));
	if (cookie) {
		try {
			const arr = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
			// Converte prezzo e quantita in numeri
			carrello.value = arr.map(item => ({
				...item,
				prezzo: Number(item.prezzo),
				quantita: Number(item.quantita)
			}));
		} catch {
			carrello.value = [];
		}
	} else {
		carrello.value = [];
	}
	calcolaTotale();
	calcolaTotaleProdotti();
}


function calcolaTotale() {
	totale.value = carrello.value.reduce((acc, prod) => acc + (prod.prezzo * prod.quantita), 0);
}

onMounted(() => {
	leggiCarrelloDaCookie();
});

async function processaTransazione() {
	if (!email.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
		alert("Inserisci un'email valida.");
		return;
	}

	if (!carrello.value.length) {
		alert("Il carrello è vuoto.");
		return;
	}

	try {
		const res = await fetch('http://localhost:3000/api/carrello/salvaOrdine', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: email.value,
				prezzoTot: totale.value,
				prodotti: carrello.value
			})
		});

		const data = await res.json();
		if (data.success) {
			alert(`Ordine salvato! Grazie ${email.value}. Il tuo ID ordine è: ${data.idOrdine}`);

			// Elimina cookie
			document.cookie = 'carrello=; path=/; max-age=0';

			// Svuota carrello locale
			carrello.value = [];
			totale.value = 0;
			totaleProdotti.value = 0;
			email.value = '';
		} else {
			alert('Errore nel salvataggio dell\'ordine.');
		}
	} catch (err) {
		console.error(err);
		alert('Errore di connessione al server.');
	}
}
</script>

<template>
	<div class="carrelli-flex">
		<div class="carrello-container">
			<h2>Il tuo carrello</h2>
			<div v-if="carrello.length">
				<table class="tabella-carrello">
					<thead>
						<tr>
							<th>Prodotto</th>
							<th>Quantità</th>
							<th>Prezzo Totale</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in carrello" :key="item.nome">
							<td>{{ item.nome }}</td>
							<td>{{ item.quantita }}</td>
							<td>{{ (item.prezzo * item.quantita).toFixed(2) }} €</td>
						</tr>
					</tbody>
				</table>
			</div>
			<p v-else>Il carrello è vuoto.</p>
		</div>
		<div class="checkout-container">
			<div class="totale-carrello">
				<strong>Totale complessivo: {{ totale.toFixed(2) }} €</strong>
			</div>
			<div class="totale-prodotti">
				<span>Numero totale prodotti: <strong>{{ totaleProdotti }}</strong></span>
			</div>
			<div class="email-input">
				<label for="email">Email per la ricevuta:</label>
				<input id="email" v-model="email" type="email" placeholder="Inserisci la tua email" />
			</div>
			<button class="checkout-btn" @click="processaTransazione">Processa transazione</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import '../styles/carrello.scss';
</style>
