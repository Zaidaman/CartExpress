const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// Configurazione SQL Server
const config = {
    user: 'User',
    password: 'User',
    server: 'localhost',
    database: 'CartExpress',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// Endpoint per ottenere i dati
app.get('/api/utenti', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM Prodotti');
        res.json(result.recordset);
    } catch (err) {
        console.error('Errore query SQL:', err);
        res.status(500).json({ error: 'Errore nel recupero dati' });
    }
});

// Avvia server
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend avviato su http://localhost:${PORT}`));
