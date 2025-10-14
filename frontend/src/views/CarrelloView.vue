<script setup>
import { ref, onMounted } from 'vue';

const carrello = ref([]);
const totale = ref(0);
const totaleProdotti = ref(0);
const dataRitiro = ref("");
const utente = ref(null);

function calcolaTotaleProdotti() {
    totaleProdotti.value = carrello.value.reduce((acc, prod) => acc + prod.quantita, 0);
}

function calcolaTotale() {
    totale.value = carrello.value.reduce((acc, prod) => acc + (prod.prezzo * prod.quantita), 0);
}

function leggiCarrelloDaCookie() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('carrello='));
    if (cookie) {
        try {
            const arr = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
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

onMounted(() => {
    leggiCarrelloDaCookie();
    // Recupera utente da localStorage
    const utenteSalvato = localStorage.getItem('utente');
    if (utenteSalvato) {
        try {
            utente.value = JSON.parse(utenteSalvato);
        } catch {
            utente.value = null;
        }
    }
});

async function processaTransazione() {
    if (!utente.value || !utente.value.Email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(utente.value.Email)) {
        alert("Utente non valido. Effettua il login.");
        return;
    }

    if (!carrello.value.length) {
        alert("Il carrello è vuoto.");
        return;
    }

    if (!dataRitiro.value) {
        alert("Inserisci la data e l'orario di ritiro.");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/carrello/salvaOrdine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: utente.value.Email,
                prezzoTot: totale.value,
                prodotti: carrello.value,
                dataRitiro: dataRitiro.value
            })
        });

        const data = await res.json();
        if (data.success) {
            alert(`Ordine salvato! Grazie ${utente.value.Email}. Il tuo ID ordine è: ${data.idOrdine}`);

            document.cookie = 'carrello=; path=/; max-age=0';

            carrello.value = [];
            totale.value = 0;
            totaleProdotti.value = 0;
            dataRitiro.value = '';
        } else {
            alert(`Errore: ${data.error || 'Ordine non salvato.'}`);
        }
    } catch (err) {
        console.error(err);
        alert('Errore di connessione al server.');
    }
}

    document.cookie = 'carrello=; path=/; max-age=0';
    carrello.value = [];
    totale.value = 0;
    totaleProdotti.value = 0;
    dataRitiro.value = '';

function aggiornaCookieCarrello() {
    document.cookie = `carrello=${encodeURIComponent(JSON.stringify(carrello.value))}; path=/; max-age=604800`; // 7 giorni
}

function incrementaQuantita(item) {
    const prodotto = carrello.value.find(p => p.nome === item.nome);
    if (prodotto) {
        prodotto.quantita += 1;
        calcolaTotale();
        calcolaTotaleProdotti();
        aggiornaCookieCarrello();
    }
}

function decrementaQuantita(item) {
    const prodotto = carrello.value.find(p => p.nome === item.nome);
    if (prodotto) {
        if (prodotto.quantita > 1) {
            prodotto.quantita -= 1;
        } else {
            carrello.value = carrello.value.filter(p => p.nome !== item.nome);
        }
        calcolaTotale();
        calcolaTotaleProdotti();
        aggiornaCookieCarrello();
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
                            <td>
                                <button @click="decrementaQuantita(item)" class="btn-qta">-</button>
                                {{ item.quantita }}
                                <button @click="incrementaQuantita(item)" class="btn-qta">+</button>
                            </td>
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

            <div class="email-info">
                <label>Email per la ricevuta:</label>
                <span><strong>{{ utente?.Email || 'Non loggato' }}</strong></span>
            </div>

            <div class="ritiro-input">
                <label for="dataRitiro">Data e ora ritiro:</label>
                <input id="dataRitiro" v-model="dataRitiro" type="datetime-local" />
            </div>

            <button class="checkout-btn" @click="processaTransazione" :disabled="!utente?.Email || !dataRitiro || carrello.length === 0">
                Processa transazione
            </button>
            <button class="checkout-btn svuota-btn" @click="svuotaCarrello">Svuota carrello</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '../styles/carrello.scss' as *;
</style>
