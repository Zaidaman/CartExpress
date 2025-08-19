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

function processaTransazione() {
	if (!email.value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)) {
		alert("Inserisci un'email valida.");
		return;
	}
	// Qui puoi aggiungere la logica per processare la transazione
	alert(`Transazione processata per ${email.value}!`);
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

.carrelli-flex {
	display: flex;
	gap: 2rem;
	align-items: flex-start;
}

.checkout-container {
	min-width: 300px;
	background: #f8f8f8;
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0,0,0,0.07);
	padding: 2rem 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1.2rem;
}

.checkout-container .totale-carrello {
	font-size: 1.2rem;
}

.checkout-container .totale-prodotti {
	font-size: 1rem;
}

.email-input {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
}

.checkout-btn {
	background: #2ecc40;
	color: #fff;
	border: none;
	border-radius: 5px;
	padding: 0.7rem 1.2rem;
	font-size: 1rem;
	cursor: pointer;
	transition: background 0.2s;
}
.checkout-btn:hover {
	background: #27ae38;
}
</style>
