const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurazione MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',        // il tuo utente MySQL
    password: 'root',        // la tua password MySQL
    database: 'cartexpress',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// Endpoint: prodotti di una categoria casuale
app.get('/api/prodotti/randomCategoria', async (req, res) => {
   try {
        // Prendi 15 prodotti casuali
        const [prodotti] = await pool.query(
            'SELECT Nome AS nome, Immagine AS immagine FROM Prodotti ORDER BY RAND() LIMIT 15'
        );

        res.json({ prodotti }); // output uguale al precedente
    } catch (err) {
        console.error('Errore random prodotti:', err);
        res.status(500).json({ error: 'Errore nel recupero prodotti casuali' });
    }
});

app.get('/api/prodotti/GetCategorie', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Categoria');
        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

// Endpoint: tutti i prodotti senza filtro categoria
app.get('/api/prodotti/tutti', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT Nome AS nome, Prezzo AS prezzo, Immagine AS immagine FROM Prodotti'
        );
        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

app.get('/api/prodotti/categoria/:idCategoria', async (req, res) => {
    const { idCategoria } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT Nome AS nome, Prezzo AS prezzo, Immagine AS immagine FROM Prodotti WHERE IdCategoria = ?',
            [idCategoria]
        );
        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

// API: Salvataggio Ordine
app.post('/api/carrello/salvaOrdine', async (req, res) => {
    const { email, prezzoTot, prodotti, dataRitiro } = req.body;

    try {
        // Controllo che l'input è rispettato
        if (!email || !prezzoTot || !prodotti || !dataRitiro) {
            return res.status(400).json({ success: false, error: 'Dati mancanti' });
        }

        // Controllo che la data di ritiro sia valida
        const ritiroDate = new Date(dataRitiro);
        if (isNaN(ritiroDate.getTime())) {
            return res.status(400).json({ success: false, error: 'Data ritiro non valida' });
        }

        // Selezione Day of the Week(DoW)
        const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        const giornoSettimana = giorni[ritiroDate.getDay()];

        // Normalizzazione Orario a HH:mm
        const oraRitiro = ritiroDate.toTimeString().slice(0, 5);

        // Query per il recupero dell'orario del negozio al corrispondente DoW
        const [orari] = await pool.query(
            'SELECT OrarioApertura, OrarioChiusura FROM OrariNegozio WHERE Giorno = ?',
            [giornoSettimana]
        );

        // Controllo del recupero dei dati da Query
        if (!orari.length) {
            return res.status(400).json({ success: false, error: 'Orari non trovati per questo giorno' });
        }

        // Normalizzazione Dati Orario Negozio
        const { OrarioApertura, OrarioChiusura } = orari[0];

        // Controllo se il negozio è chiuso
        if (!OrarioApertura || !OrarioChiusura) {
            return res.status(400).json({ success: false, error: 'Il negozio è chiuso in questo giorno' });
        }

        // Calcolo orario in minuti per orario ritiro
        const [ritiroH, ritiroM] = oraRitiro.split(':').map(Number);
        const minutiRitiro = ritiroH * 60 + ritiroM;

        // Calcolo orario in minuti per orario apertura negozio
        const [aperturaH, aperturaM] = OrarioApertura.split(':').map(Number);
        const minutiApertura = aperturaH * 60 + aperturaM;

        // Calcolo orario in minuti per orario chiusura negozio
        const [chiusuraH, chiusuraM] = OrarioChiusura.split(':').map(Number);
        const minutiChiusura = chiusuraH * 60 + chiusuraM;

        // Controllo che orario ritiro corrisponda all'orario di apertura del negozio
        if (minutiRitiro < minutiApertura || minutiRitiro > minutiChiusura) {
            return res.status(400).json({ success: false, error: 'Orario non disponibile per il ritiro' });
        }

        // Calcolo IdOrdine
        const [resultQuery] = await pool.query(
            'SELECT MAX(IdOrdine) + 1 AS IdOrdine FROM ordini'
        );
        const idOrdine = resultQuery[0].IdOrdine || 1;

        // Salvataggio Ordine
        await pool.query(
            'INSERT INTO ordini (email, PrezzoTotale, DataRitiro, DataCreazione, ListaProdotti) VALUES (?, ?, ?, NOW(), ?)',
            [email, prezzoTot, dataRitiro, JSON.stringify(prodotti)]
        );

        // Creazione istanza Mail, raccolta dati accesso da file .env
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Creazione testo Mail
        let mailOptions = {
            from: `CartExpress <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Conferma ordine CartExpress',
            text: `Grazie per il tuo ordine!
            ID ordine: ${idOrdine}
            Totale: €${prezzoTot}
            Data ritiro: ${dataRitiro}
            Prodotti: ${prodotti.map(p => `\n- ${p.nome} x${p.quantita}`).join('')}
            A presto su CartExpress!`,
        };

        // Invio Mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Errore invio email:', error);
            } else {
                console.log('Email inviata:', info.response);
            }
        });

        res.json({ success: true, idOrdine: idOrdine });
    } catch (err) {
        console.error('Errore salvataggio ordine:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/carrello/getOrdine/:idOrdine', async (req, res) => {
    const { idOrdine } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT IdOrdine, Email, PrezzoTotale, CAST(DataRitiro AS NCHAR) AS DataRitiro, CAST(DataCreazione AS NCHAR) AS DataCreazione, ListaProdotti FROM ordini WHERE idOrdine = ?',
            [idOrdine]
        );

        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

app.get('/api/recensioni/:nomeProdotto', async (req, res) => {
    const { nomeProdotto } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT r.Voto, LEFT(r.Commento, 50) AS Commento, r.DataCreazione, u.Username
             FROM Recensioni r
             JOIN Utenti u ON r.IdUtente = u.IdUtente
             WHERE r.NomeProdotto = ?
             ORDER BY r.DataCreazione DESC`,
            [nomeProdotto]
        );
        res.json(rows);
    } catch (err) {
        console.error('Errore nel recupero recensioni:', err);
        res.status(500).json({ error: 'Errore nel recupero recensioni' });
    }
});

// Calcolo media voto delle recensioni di un prodotto
app.get('/api/recensioni/media/:nomeProdotto', async (req, res) => {
    const { nomeProdotto } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT ROUND(AVG(Voto), 1) AS media FROM Recensioni WHERE NomeProdotto = ?',
            [nomeProdotto]
        );
        res.json(rows[0]);
    } catch (err) {
        console.error('Errore nel calcolo media:', err);
        res.status(500).json({ error: 'Errore nel calcolo media' });
    }
});

app.post('/api/recensioni', async (req, res) => {
    const { nomeProdotto, voto, commento, idUtente } = req.body;
    try {
        if (!nomeProdotto || !voto || !idUtente) {
            return res.status(400).json({ error: 'Dati mancanti' });
        }
        // Verifica se l'utente ha già recensito questo prodotto
        const [esiste] = await pool.query(
            'SELECT Id FROM Recensioni WHERE NomeProdotto = ? AND IdUtente = ?',
            [nomeProdotto, idUtente]
        );
        if (esiste.length > 0) {
            return res.status(409).json({ error: 'Hai già recensito questo prodotto.' });
        }
        await pool.query(
            'INSERT INTO Recensioni (NomeProdotto, Voto, Commento, IdUtente) VALUES (?, ?, ?, ?)',
            [nomeProdotto, voto, commento || null, idUtente]
        );
        res.json({ success: true, message: 'Recensione aggiunta con successo' });
    } catch (err) {
        console.error('Errore inserimento recensione:', err);
        res.status(500).json({ error: 'Errore nel salvataggio della recensione' });
    }
});

// Avvia server
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend avviato su http://localhost:${PORT}`));


// Endpoint login utente

// Endpoint registrazione utente
app.post('/api/utenti/registrazione', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, error: 'Tutti i campi sono obbligatori' });
    }
    try {
        // Controlla se l'email esiste già
        const [esiste] = await pool.query('SELECT Username FROM Utenti WHERE Email = ?', [email]);
        if (esiste.length > 0) {
            return res.status(409).json({ success: false, error: 'Email già registrata' });
        }
        // Controlla se lo username esiste già
        const [esisteUser] = await pool.query('SELECT Username FROM Utenti WHERE Username = ?', [username]);
        if (esisteUser.length > 0) {
            return res.status(409).json({ success: false, error: 'Username già registrato' });
        }
        // Inserisci nuovo utente
        await pool.query(
            'INSERT INTO Utenti (Username, Email, Password, Ruolo) VALUES (?, ?, ?, ?)',
            [username, email, password, 'user']
        );
        res.json({ success: true, message: 'Registrazione avvenuta con successo' });
    } catch (err) {
        console.error('Errore registrazione utente:', err);
        res.status(500).json({ success: false, error: 'Errore server' });
    }
});

// Endpoint login utente
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email e password obbligatorie' });
    }
    try {
        const [rows] = await pool.query(
            'SELECT IdUtente, Username, Email, Ruolo FROM Utenti WHERE Email = ? AND Password = ?',
            [email, password]
        );
        if (rows.length === 1) {
            res.json({ success: true, utente: rows[0] });
        } else {
            res.status(401).json({ success: false, error: 'Credenziali non valide' });
        }
    } catch (err) {
        console.error('Errore login:', err);
        res.status(500).json({ success: false, error: 'Errore server' });
    }
});
