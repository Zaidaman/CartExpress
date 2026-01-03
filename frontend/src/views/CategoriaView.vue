<script setup>

import { ref, onMounted, reactive } from 'vue';

const showDropdown = ref(false);

const categorie = ref([]);
const prodotti = ref([]);
const quantitaProdotti = reactive({});
const categoriaSelezionata = ref(null);

const utente = ref(null);
const idUtente = ref(null);

const filtroPrezzo = ref(null);      // 'asc' | 'desc' | null
const filtroValutazione = ref(null); // 'asc' | 'desc' | null

onMounted(async () => {
	// Recupera utente da localStorage
	const utenteSalvato = localStorage.getItem('utente');
	if (utenteSalvato) {
		try {
			utente.value = JSON.parse(utenteSalvato);
			idUtente.value = utente.value.IdUtente;
		} catch {
			utente.value = null;
			idUtente.value = null;
		}
	} else {
		utente.value = null;
		idUtente.value = null;
	}
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
	if (!idUtente.value) {
		alert('Devi essere loggato per aggiungere prodotti al carrello.');
		return;
	}
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
	const cookieName = `carrello_${idUtente.value}`;
	const cookie = document.cookie.split('; ').find(row => row.startsWith(cookieName + '='));
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
	document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(carrello))}; path=/; max-age=604800`;
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

// Overlay recensione
const overlayRecensione = reactive({
	aperto: false,
	nomeProdotto: null,
	voto: 0,
	commento: '',
});

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

function apriOverlayRecensione(nomeProdotto, voto) {
	overlayRecensione.aperto = true;
	overlayRecensione.nomeProdotto = nomeProdotto;
	overlayRecensione.voto = voto;
	overlayRecensione.commento = '';
}

function chiudiOverlayRecensione() {
	overlayRecensione.aperto = false;
	overlayRecensione.nomeProdotto = null;
	overlayRecensione.voto = 0;
	overlayRecensione.commento = '';
}

async function inviaRecensioneOverlay() {
	const nomeProdotto = overlayRecensione.nomeProdotto;
	const voto = overlayRecensione.voto;
	const commento = overlayRecensione.commento.slice(0, 50);
	votoSelezionato[nomeProdotto] = voto;
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
		chiudiOverlayRecensione();
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
	votoSelezionato[nomeProdotto] = 0;
	hoverVoto[nomeProdotto] = 0;
	chiudiOverlayRecensione();
}

function applicaFiltri() {
	let lista = [...prodotti.value];

	// Ordina per prezzo
	if (filtroPrezzo.value) {
		lista.sort((a, b) =>
			filtroPrezzo.value === 'asc'
				? a.prezzo - b.prezzo
				: b.prezzo - a.prezzo
		);
	}

	// Ordina per valutazione media
	if (filtroValutazione.value) {
		lista.sort((a, b) => {
			const votoA = mediaRecensioni[a.nome] || 0;
			const votoB = mediaRecensioni[b.nome] || 0;
			return filtroValutazione.value === 'asc'
				? votoA - votoB
				: votoB - votoA;
		});
	}

	prodotti.value = lista;
}

async function azzeraFiltri() {
	filtroPrezzo.value = null;
	filtroValutazione.value = null;

	// Ricarica i prodotti della categoria corrente
	if (categoriaSelezionata.value === null) {
		await caricaProdotti(null);
	} else {
		await caricaProdotti(categoriaSelezionata.value);
	}
}
</script>

<template>
	<div id="notifica-container" style="position: fixed;top: 20px;right: 20px;z-index: 9999;"></div>
	<div class="categorie-prodotti-wrapper">
		<div class="dropdown-categorie-wrapper">
			<button class="btn-dropdown-categorie" @click="showDropdown = !showDropdown">
				☰
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
				<p class="filtri-title">⎯⎯⎯⎯ Filtri di Ricerca ⎯⎯⎯⎯</p>
				<div class="filtri-ricerca">
					<button @click="filtroPrezzo='asc'; filtroValutazione=null; applicaFiltri()">
						Prezzo ↑
					</button>
					<button @click="filtroPrezzo='desc'; filtroValutazione=null; applicaFiltri()">
						Prezzo ↓
					</button>
					<button @click="filtroValutazione='desc'; filtroPrezzo=null; applicaFiltri()">
						Valutazione ⭐
					</button>
					<button class="reset-filtri" @click="azzeraFiltri">
						Azzera filtri
					</button>
				</div>
			</div>
		</div>
		<div class="prodotti-container">
			<h2 style="margin-top: 0; margin-bottom: 1.2em;">Prodotti</h2>
			<div v-if="prodotti.length === 0">
				<p>Nessun prodotto trovato.</p>
			</div>
			<div v-else>
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
										@click="apriOverlayRecensione(prod.nome, i)">
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
										<ul v-if="(recensioni[prod.nome] || []).length" class="lista-recensioni">
											<li v-for="r in recensioni[prod.nome]" :key="r.DataCreazione">
												<strong>{{ r.Voto }} ⭐</strong>
												<span v-if="r.Username"><b>{{ r.Username }}</b></span>
												<span>{{ r.Commento || 'Nessun commento' }}</span>
											</li>
										</ul>
										<p v-else>Nessuna recensione disponibile per questo prodotto.</p>
									</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
			<div v-if="overlayRecensione.aperto" class="recensione-commento-overlay">
				<div class="recensione-commento-panel">
					<h3 class="recensione-commento-titolo">Lascia una recensione per <b>{{ overlayRecensione.nomeProdotto }}</b></h3>
					<div class="recensione-commento-stelle">
						<span v-for="i in 5" :key="i"
							:class="{ active: i <= overlayRecensione.voto }"
							@mouseover="overlayRecensione.voto = i"
							@click="overlayRecensione.voto = i"
						>★</span>
					</div>
					<label for="commento-input" class="recensione-commento-label">Commento (opzionale, max 50 caratteri):</label>
					<input id="commento-input" type="text" v-model="overlayRecensione.commento" maxlength="50" class="recensione-commento-input" />
					<div class="recensione-commento-bottoni">
						<button @click="inviaRecensioneOverlay" class="recensione-commento-invia">Invia</button>
						<button @click="chiudiOverlayRecensione" class="recensione-commento-annulla">Annulla</button>
					</div>
				</div>
			</div>
		</div>
</template>

<style lang="scss" scoped>
@use '../styles/categoria.scss' as *;
</style>