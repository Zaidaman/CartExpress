<script setup>
import { ref, onMounted } from 'vue';

const carrello = ref([]);
const totale = ref(0);

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
}

function calcolaTotale() {
	totale.value = carrello.value.reduce((acc, prod) => acc + (prod.prezzo * prod.quantita), 0);
}

onMounted(() => {
	leggiCarrelloDaCookie();
});
</script>

<template>
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
			<div class="totale-carrello">
				<strong>Totale complessivo: {{ totale.toFixed(2) }} €</strong>
			</div>
		</div>
		<p v-else>Il carrello è vuoto.</p>
	</div>
</template>

<style lang="scss" scoped>
@import '../styles/carrello.scss';
</style>
