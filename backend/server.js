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

// Endpoint per ottenere dati
app.get('/api/prodotti', async (req, res) => {
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


// Avvia server
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend avviato su http://localhost:${PORT}`));
