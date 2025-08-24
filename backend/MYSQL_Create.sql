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
    Quantita INT NOT NULL DEFAULT 0,
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
    DataCreazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ListaProdotti VARCHAR(4000) NOT NULL 
);

USE CartExpress;

INSERT INTO Categoria (Nome, Immagine) VALUES
('Frutta', 'img/cat/frutta.png'),
('Verdura', 'img/cat/verdura.png'),
('Pasta', 'img/cat/pasta.png'),
('Pane', 'img/cat/pane.png'),
('Latticini', 'img/cat/latticini.png');

-- Inserimento prodotti
INSERT INTO Prodotti (Nome, Quantita, Prezzo, Immagine, IdCategoria) VALUES
('Mela', 100, 0.50, 'img/prod/mela.png', 1),
('Banana', 80, 0.70, 'img/prod/banana.png', 1),
('Farfalle', 50, 1.20, 'img/prod/farfalle.png', 3),
('Alberghiero', 40, 1.00, 'img/prod/alberghiero.png', 4),
('Latte', 60, 1.30, 'img/prod/latte.png', 5),
('Uova', 30, 2.50, 'img/prod/uova.png', 5),
('Biscotti', 45, 1.80, 'img/prod/biscotti.png', 4),
('Formaggio', 25, 3.50, 'img/prod/formaggio.png', 5),
('Pomodori', 90, 1.10, 'img/prod/pomodori.png', 2),
('Olio di oliva', 20, 5.00, 'img/prod/olio.png', 2);

-- Inserimento Ordine Carrello
INSERT INTO Ordini (Email, PrezzoTotale, DataCreazione, ListaProdotti)
VALUES ('pippo@gmail.com', 2.00, '2025-08-16 14:30:00', '[{"nome":"Olio di oliva","prezzo":5,"quantita":1},{"nome":"Banana","prezzo":0.7,"quantita":3},{"nome":"Latte","prezzo":1.3,"quantita":2}]');

-- Formazione ListaProdotti: Nome Quantità Prezzo PrezzoSubTotale