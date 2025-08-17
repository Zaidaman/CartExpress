
<template>
	<div class="view-container">
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