
<template>
	<div class="carrello-view">
		<h1>Carrello</h1>
		<input v-model="dato" type="text" placeholder="Inserisci un dato" />
		<button @click="inviaDato">Invia</button>
		<button @click="tornaHome">Torna alla Home</button>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const dato = ref('');

const inviaDato = () => {
	alert(`Dato inviato: ${dato.value}`);
};

const tornaHome = () => {
	router.push('/');
};
</script>

<style scoped>
.carrello-view {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
	max-width: 300px;
	margin: 40px auto;
}
input {
	padding: 6px;
	width: 100%;
	box-sizing: border-box;
}
button {
	padding: 6px 12px;
	margin-top: 5px;
}
</style>
