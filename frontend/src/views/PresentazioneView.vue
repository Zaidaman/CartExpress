<template>
	<div class="presentazione">
		<h1>Benvenuto su CartExpress!</h1>
		<p>
			CartExpress è il tuo sito per la gestione semplice<br>e veloce della spesa online.<br><br>Ecco cosa puoi fare:
		</p>
		<ul>
			<li>Visualizzare le categorie di prodotti disponibili</li>
			<li>Effettuare ricerche tra i prodotti</li>
			<li>Aggiungere prodotti al carrello</li>
			<li>Gestire il tuo carrello e completare l'acquisto</li>
			<li>Accedere con il tuo account per una esperienza personalizzata</li>
		</ul>
		<div style="margin-top:2rem; text-align:center;">
			<router-link to="/login">
				<button class="btn-login">Accedi</button>
			</router-link>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '../styles/presentazione.scss' as *;
</style>
