const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // versione Promise

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
        console.log('Dati ricevuti da MySQL:', rows);
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
            'SELECT * FROM ordini WHERE idOrdine = ?',
            [idOrdine]
        );
        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

// Avvia server
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend avviato su http://localhost:${PORT}`));
