CREATE DATABASE CARTEXPRESS;
USE CartExpress;

CREATE TABLE Categoria (
    IdCategoria INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Immagine VARCHAR(250) -- percorso immagine
);

-- Tabella Prodotti
CREATE TABLE Prodotti (
    Nome VARCHAR(100) NOT NULL PRIMARY KEY,
    Prezzo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Immagine VARCHAR(250), -- percorso immagine
    IdCategoria INT NOT NULL DEFAULT 1,
    FOREIGN KEY (IdCategoria) REFERENCES Categoria(IdCategoria)
);

-- Tabella Carrelli
CREATE TABLE Ordini (
    IdOrdine INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(150) NOT NULL,
    PrezzoTotale DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    DataRitiro DATETIME NOT NULL,
    DataCreazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ListaProdotti VARCHAR(4000) NOT NULL
);

CREATE TABLE Recensioni (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    NomeProdotto VARCHAR(255) NOT NULL,
    Voto INT CHECK (Voto BETWEEN 1 AND 5),
    Commento TEXT,
    DataCreazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OrariNegozio (
    Giorno VARCHAR(50) NOT NULL PRIMARY KEY,
    OrarioApertura VARCHAR(50),
    OrarioChiusura VARCHAR(50)
);

USE CartExpress;

INSERT INTO Categoria (Nome, Immagine) VALUES
('Frutta', 'img/cat/frutta.png'),
('Verdura', 'img/cat/verdura.png'),
('Pasta', 'img/cat/pasta.png'),
('Pane', 'img/cat/pane.png'),
('Latticini', 'img/cat/latticini.png');

-- Inserimento prodotti
INSERT INTO Prodotti (Nome, Prezzo, Immagine, IdCategoria) VALUES
('Mela', 0.50, 'img/prod/mela.png', 1),
('Banana', 0.70, 'img/prod/banana.png', 1),
('Kiwi', 1.00, 'img/prod/kiwi.png', 1),
('Pera', 0.80, 'img/prod/pera.png', 1),
('Pesca', 1.20, 'img/prod/pesca.png', 1),

('Pomodori', 1.10, 'img/prod/pomodori.png', 2),
('Cetrioli', 0.90, 'img/prod/cetrioli.png', 2),
('Carote', 0.80, 'img/prod/carote.png', 2),
('Zucchine', 1.00, 'img/prod/zucchine.png', 2),
('Cipolle', 0.60, 'img/prod/cipolle.png', 2),

('Farfalle', 1.20, 'img/prod/farfalle.png', 3),
('Penne', 1.00, 'img/prod/penne.png', 3),
('Spaghetti', 1.50, 'img/prod/spaghetti.png', 3),
('Fusilli', 1.20, 'img/prod/fusilli.png', 3),
('Tortiglioni', 1.10, 'img/prod/tortiglioni.png', 3),

('Alberghiero', 1.00, 'img/prod/alberghiero.png', 4),
('Biscotti', 1.80, 'img/prod/biscotti.png', 4),
('Frusta', 2.00, 'img/prod/frusta.png', 4),
('Ciabatta', 1.50, 'img/prod/ciabatta.png', 4),
('Grissini', 1.20, 'img/prod/grissini.png', 4),

('Latte', 1.30, 'img/prod/latte.png', 5),
('Uova', 2.50, 'img/prod/uova.png', 5),
('Formaggio', 3.50, 'img/prod/formaggio.png', 5),
('Burro', 2.00, 'img/prod/burro.png', 5),
('Yogurt', 1.50, 'img/prod/yogurt.png', 5);

-- Inserimento Ordine Carrello
INSERT INTO Ordini (Email, PrezzoTotale, DataCreazione, ListaProdotti)
VALUES ('pippo@gmail.com', 2.00, '2025-08-17 16:00:00', '2025-08-16 14:30:00', '[{"nome":"Olio di oliva","prezzo":5,"quantita":1},{"nome":"Banana","prezzo":0.7,"quantita":3},{"nome":"Latte","prezzo":1.3,"quantita":2}]');

INSERT INTO Recensioni (NomeProdotto, Voto, Commento) VALUES
-- Mela
('Mela', 5, 'Ottima qualità, molto dolce e fresca'),
('Mela', 4, 'Buona ma un po’ piccola'),
('Mela', 3, NULL),

-- Banana
('Banana', 5, 'Banane perfette per smoothie'),
('Banana', 4, NULL),
('Banana', 2, 'Un po’ troppo mature per i miei gusti'),

-- Farfalle
('Farfalle', 4, 'Pasta di buona qualità, tiene bene la cottura'),
('Farfalle', 3, NULL),

-- Latte
('Latte', 5, 'Fresco e con un buon sapore'),
('Latte', 2, 'Non mi è piaciuto il sapore'),

-- Uova
('Uova', 4, 'Ottime per fare dolci'),
('Uova', 3, NULL),

-- Biscotti
('Biscotti', 5, 'Deliziosi! Perfetti con il tè'),
('Biscotti', 4, NULL),

-- Pomodori
('Pomodori', 4, 'Pomodori freschi e saporiti'),
('Pomodori', 2, NULL);

INSERT INTO OrariNegozio ( Giorno , OrarioApertura , OrarioChiusura ) VALUES
('Lunedì','7:30','13:00'),
('Martedì','7:30','18:00'),
('Mercoledì','7:30','18:00'),
('Giovedì','7:30','18:00'),
('Venerdì','7:30','18:00'),
('Sabato','7:30','17:00'),
('Domenica', NULL ,NULL);