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

// API Test MySQL
app.get('/api/testProdotti', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Prodotti');
        
        // Stampa i dati sulla console
        console.log('Dati ricevuti da MySQL:', rows);
        
        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});


app.get('/api/testCategorie', async (req, res) => {
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
            'SELECT * FROM Prodotti WHERE IdCategoria = ?',
            [idCategoria]
        );
        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

// API Test MySQL
app.get('/api/testProdotti', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Prodotti');
        
        // Stampa i dati sulla console
        console.log('Dati ricevuti da MySQL:', rows);
        
        res.json(rows);
    } catch (err) {
        console.error('Errore query MySQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

app.post('/api/login', async (req, res) => {
    const { Nome, Password } = { Nome: 'MarioRossi', Password: 'pass' }; //req.body; // dati inviati dal frontend

    try {
        const [rows] = await pool.query(
            'SELECT IdUtente FROM Utente WHERE Nome = ? AND Password <= ?',
            [Nome, Password] // valori sicuri con placeholders
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
