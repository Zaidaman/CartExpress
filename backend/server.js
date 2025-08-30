const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // versione Promise
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

app.get('/api/prodotti/GetCategorie', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Categoria');
        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

// API: prodotti per categoria
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
    const { email, prezzoTot, prodotti } = req.body;
    try {
        if (!email || !prezzoTot || !prodotti) {
            return res.status(400).json({ success: false, error: 'Dati mancanti' });
        }

        const [resultQuery] = await pool.query(
            'SELECT MAX(IdOrdine) + 1 AS IdOrdine FROM ordini'
        );

        const idOrdine = resultQuery[0].IdOrdine;

        await pool.query(
            'INSERT INTO ordini (email, PrezzoTotale, DataCreazione, ListaProdotti) VALUES (?, ?, NOW(), ?)',
            [email, prezzoTot, JSON.stringify(prodotti)]
        );
        
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'lucavigno2003@gmail.com', // Cambia con la tua email
                pass: 'rlbs fqvd zwgc bbsc', // Cambia con la tua password/app password
            },
        });

        // Componi il messaggio
        let mailOptions = {
            from: `CartExpress <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Conferma ordine CartExpress',
            text: `Grazie per il tuo ordine!\nID ordine: ${idOrdine}\nTotale: €${prezzoTot}\n\nProdotti: ${prodotti.map(p => `\n- ${p.nome} x${p.quantita}`).join('')}\n\nA presto su CartExpress!`,
        };

        // Invia la mail (non blocca la risposta all'utente)
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Errore invio email:', error);
            } else {
                console.log('Email inviata:', info.response);
            }
        });

        res.json({
                success: true,
                idOrdine: idOrdine
        });
    } catch (err) {
        console.error('Errore salvataggio ordine:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/carrello/getOrdine/:idOrdine', async (req, res) => {
    const { idOrdine } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT IdOrdine, Email, PrezzoTotale, CAST(DataCreazione AS NCHAR) AS DataCreazione, ListaProdotti FROM ordini WHERE idOrdine = ?',
            [idOrdine]
        );

        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

// Ottieni recensioni di un prodotto
app.get('/api/recensioni/:nomeProdotto', async (req, res) => {
    const { nomeProdotto } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT Voto, LEFT(Commento, 50) AS Commento, DataCreazione FROM Recensioni WHERE NomeProdotto = ? ORDER BY DataCreazione DESC',
            [nomeProdotto]
        );
        res.json(rows);
    } catch (err) {
        console.error('Errore nel recupero recensioni:', err);
        res.status(500).json({ error: 'Errore nel recupero recensioni' });
    }
});

// Ottieni media delle recensioni
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

// Aggiungi una nuova recensione
app.post('/api/recensioni', async (req, res) => {
    const { nomeProdotto, voto, commento } = req.body;
    try {
        if (!nomeProdotto || !voto) {
            return res.status(400).json({ error: 'Dati mancanti' });
        }
        await pool.query(
            'INSERT INTO Recensioni (NomeProdotto, Voto, Commento) VALUES (?, ?, ?)',
            [nomeProdotto, voto, commento || null]
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
