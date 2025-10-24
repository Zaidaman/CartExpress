<script setup>
import { ref, onMounted, reactive } from 'vue';

const showDropdown = ref(false);

const categorie = ref([]);
const prodotti = ref([]);
const quantitaProdotti = reactive({});
const categoriaSelezionata = ref(null);

// Carica tutte le categorie all'avvio

onMounted(async () => {
	try {
		// Carica categorie
		const resCat = await fetch('http://localhost:3000/api/prodotti/GetCategorie');
		categorie.value = await resCat.json();

		// Carica tutti i prodotti all'avvio
		const resProd = await fetch('http://localhost:3000/api/prodotti/tutti');
		prodotti.value = await resProd.json();
		for (const key in quantitaProdotti) delete quantitaProdotti[key];
		prodotti.value.forEach(prod => {
			quantitaProdotti[prod.nome] = 1;
			caricaRecensioni(prod.nome);
		});
		categoriaSelezionata.value = null; // Nessuna categoria selezionata
	} catch (err) {
		console.error('Errore nel fetch iniziale:', err);
	}
});

// Carica prodotti per categoria
async function caricaProdotti(idCategoria) {
	categoriaSelezionata.value = idCategoria;
	try {
		let res;
		if (idCategoria === null) {
			res = await fetch('http://localhost:3000/api/prodotti/tutti');
		} else {
			res = await fetch(`http://localhost:3000/api/prodotti/categoria/${idCategoria}`);
		}
		prodotti.value = await res.json();
		// Reset quantità per i nuovi prodotti e imposta default a 1
		for (const key in quantitaProdotti) delete quantitaProdotti[key];
		prodotti.value.forEach(prod => {
			quantitaProdotti[prod.nome] = 1;
			caricaRecensioni(prod.nome);
		});
	} catch (err) {
		console.error('Errore nel fetch prodotti:', err);
		prodotti.value = [];
		quantitaProdotti.value = {};
	}
}

function aggiornaQuantita(nomeProdotto, valore) {
	quantitaProdotti[nomeProdotto] = valore;
}

function salvaInCookie(prodotto) {
	const quantita = quantitaProdotti[prodotto.nome] || 1;
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
	quantitaProdotti[prodotto.nome] = 1;
	mostraNotifica('Prodotto salvato nel carrello!');
}

function mostraNotifica(messaggio) {
    const container = document.getElementById('notifica-container');

    const notifica = document.createElement('div');
    notifica.textContent = messaggio;
    notifica.style.background = '#2d8cf0';
    notifica.style.color = '#fff';
    notifica.style.padding = '10px 16px';
    notifica.style.marginBottom = '10px';
    notifica.style.borderRadius = '8px';
    notifica.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    notifica.style.opacity = '1';
    notifica.style.transition = 'opacity 0.5s ease';

    container.appendChild(notifica);

    setTimeout(() => {
        notifica.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(notifica);
        }, 500);
    }, 3000);
}

const recensioni = reactive({});
const mediaRecensioni = reactive({});
const hoverVoto = reactive({});
const votoSelezionato = reactive({});
const prodottoAperto = ref(null);

// Carica recensioni e media per un prodotto
async function caricaRecensioni(nomeProdotto) {
    try {
        const resRecensioni = await fetch(`http://localhost:3000/api/recensioni/${nomeProdotto}`);
        recensioni[nomeProdotto] = await resRecensioni.json();

        const resMedia = await fetch(`http://localhost:3000/api/recensioni/media/${nomeProdotto}`);
        const mediaData = await resMedia.json();
        mediaRecensioni[nomeProdotto] = mediaData.media || 0;
    } catch (err) {
        console.error('Errore caricamento recensioni:', err);
    }
}

// Lascia recensione
async function lasciaRecensione(nomeProdotto, voto) {
		votoSelezionato[nomeProdotto] = voto;
		const commento = prompt('Inserisci un commento (opzionale, MAX 50 Caratteri):');
		// Recupera IdUtente dall'oggetto utente in localStorage
		let IdUtente = null;
		const utenteStr = localStorage.getItem('utente');
		if (utenteStr) {
			try {
				const utenteObj = JSON.parse(utenteStr);
				IdUtente = utenteObj.IdUtente;
			} catch {}
		}
		if (!IdUtente) {
			mostraNotifica('Devi essere loggato per lasciare una recensione.');
			return;
		}
		try {
			const res = await fetch('http://localhost:3000/api/recensioni', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nomeProdotto, voto, commento, idUtente: IdUtente })
			});
			if (res.status === 409) {
				mostraNotifica('Hai già recensito questo prodotto!');
			} else if (res.ok) {
				mostraNotifica('Recensione inviata con successo!');
				caricaRecensioni(nomeProdotto);
			} else {
				mostraNotifica('Errore nell’invio della recensione.');
			}
		} catch (err) {
			console.error('Errore salvataggio recensione:', err);
			mostraNotifica('Errore di rete nel salvataggio della recensione.');
		}
		// Reset stelle dopo invio
		votoSelezionato[nomeProdotto] = 0;
		hoverVoto[nomeProdotto] = 0;
}
</script>

<template>
	<div id="notifica-container" style="position: fixed;top: 20px;right: 20px;z-index: 9999;"></div>
	<div class="categorie-prodotti-wrapper">
		<div class="dropdown-categorie-wrapper">
			<button class="btn-dropdown-categorie" @click="showDropdown = !showDropdown">
				Seleziona categoria ▼
			</button>
			<div v-if="showDropdown" class="dropdown-categorie-menu">
				<ul>
					<li>
						<button @click="caricaProdotti(null); showDropdown = false">Tutte le categorie</button>
					</li>
					<li v-for="cat in categorie" :key="cat.IdCategoria">
						<button @click="caricaProdotti(cat.IdCategoria); showDropdown = false">
							<img :src="`/${cat.Immagine}`" alt="" style="max-width:24px;max-height:24px;margin-right:8px;" />
							<span>{{ cat.Nome }}</span>
						</button>
					</li>
				</ul>
			</div>
		</div>
		<div class="prodotti-container">
			<div v-if="prodotti.length === 0">
				<p>Nessun prodotto trovato.</p>
			</div>
			<div v-else>
				<h2>Prodotti</h2>
				<ul>
					<li v-for="prod in prodotti" :key="prod.nome" class="prodotto-item">
						<img :src="`/${prod.immagine}`" alt="" />
						<div class="info-prodotto">
							<span class="nome-prodotto">{{ prod.nome }}</span>
							<span class="prezzo-prodotto">Prezzo: {{ prod.prezzo }} €</span>
							<input type="number" min="1" v-model="quantitaProdotti[prod.nome]" @input="aggiornaQuantita(prod.nome, quantitaProdotti[prod.nome])" class="input-quantita" />
							<button @click="salvaInCookie(prod)" class="btn-salva">Salva</button>
							<div class="recensioni-container">
								<div class="media-voto">Valutazione: {{ mediaRecensioni[prod.nome] || 'N/A' }} ⭐</div>
								<div class="stelle" @mouseleave="hoverVoto[prod.nome]=0">
									<span v-for="i in 5" :key="i" 
										:class="{ active: i <= (hoverVoto[prod.nome] || votoSelezionato[prod.nome] || 0) }"
										@mouseover="hoverVoto[prod.nome]=i"
										@click="lasciaRecensione(prod.nome, i)">
										★
									</span>
								</div>
								<button @click="prodottoAperto = (prodottoAperto === prod.nome ? null : prod.nome)">
									{{ prodottoAperto === prod.nome ? 'Nascondi recensioni' : 'Mostra recensioni' }}
								</button>
								<div v-if="prodottoAperto === prod.nome" class="recensioni-overlay">
									<div class="recensioni-panel">
										<button class="close-btn" @click="prodottoAperto = null">×</button>
										<h3>Recensioni per {{ prod.nome }}</h3>
										<ul class="lista-recensioni">
											<li v-for="r in (recensioni[prod.nome] || [])" :key="r.DataCreazione">
												<strong>{{ r.Voto }} ⭐</strong>
												<span v-if="r.Username"> - <b>{{ r.Username }}</b></span>
												<span> - {{ r.Commento || 'Nessun commento' }}</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '../styles/categoria.scss' as *;
</style>