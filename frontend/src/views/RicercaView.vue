
<template>
	<div class="ricerca-container">
		<h1>Ricerca</h1>
		<input
			v-model="codice"
			type="text"
			placeholder="Inserisci il codice"
			class="ricerca-input"
		/>
		<button class="ricerca-btn" @click="invia">Invio</button>
	</div>
</template>

<script>
export default {
	name: 'RicercaView',
	data() {
		return {
			codice: '',
		};
	},
	methods: {
		invia() {
			// Azione all'invio (da personalizzare)
			alert(`Codice inserito: ${this.codice}`);
		},
	},
};
</script>