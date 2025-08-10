CREATE DATABASE CartExpress;
USE CartExpress;

-- Tabella Prodotti
CREATE TABLE Prodotti (
    IdProdotto INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Quantita INT NOT NULL DEFAULT 0,
    Prezzo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Immagine VARCHAR(250) -- percorso immagine
);

-- Tabella Utenti
CREATE TABLE Utente (
    IdUtente INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Password VARCHAR(200) NOT NULL
);

-- Tabella Carrelli
CREATE TABLE Carrello (
    IdCarrello INT AUTO_INCREMENT PRIMARY KEY,
    IdUtente INT NOT NULL,
    PrezzoTotale DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    DataCreazione DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Pagato BOOLEAN DEFAULT FALSE,
    DataPagamento DATETIME,
    FOREIGN KEY (IdUtente) REFERENCES Utente(IdUtente)
);

-- Tabella Ordini
CREATE TABLE Ordine (
    IdOrdine INT AUTO_INCREMENT PRIMARY KEY,
    IdCarrello INT NOT NULL,
    IdUtente INT NOT NULL,
    IdProdotto INT NOT NULL,
    Quantita INT NOT NULL,
    DataInserimento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PrezzoUnitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (IdCarrello) REFERENCES Carrello(IdCarrello),
    FOREIGN KEY (IdUtente) REFERENCES Utente(IdUtente),
    FOREIGN KEY (IdProdotto) REFERENCES Prodotti(IdProdotto)
);

USE CartExpress;

-- Inserimento utenti (nickname + password semplici)
INSERT INTO Utente (Nome, Password) VALUES
('MarioRossi', 'pass'),
('LucaBianchi', '12345'),
('AnnaVerdi', 'test');

-- Inserimento prodotti (.png invece di .jpg)
INSERT INTO Prodotti (Nome, Quantita, Prezzo, Immagine) VALUES
('Mela', 100, 0.50, 'img/mela.png'),
('Banana', 80, 0.70, 'img/banana.png'),
('Pasta', 50, 1.20, 'img/pasta.png'),
('Pane', 40, 1.00, 'img/pane.png'),
('Latte', 60, 1.30, 'img/latte.png'),
('Uova', 30, 2.50, 'img/uova.png'),
('Biscotti', 45, 1.80, 'img/biscotti.png'),
('Formaggio', 25, 3.50, 'img/formaggio.png'),
('Pomodori', 90, 1.10, 'img/pomodori.png'),
('Olio d\'oliva', 20, 5.00, 'img/olio.png');

-- Carrello PAGATO (IdUtente = 1)
INSERT INTO Carrello (IdUtente, PrezzoTotale, Pagato, DataPagamento)
VALUES (1, 7.60, TRUE, '2025-08-08 14:30:00');

-- Carrello NON pagato (IdUtente = 2)
INSERT INTO Carrello (IdUtente, PrezzoTotale, Pagato)
VALUES (2, 4.40, FALSE);

-- Ordini per il carrello pagato (IdCarrello = 1)
INSERT INTO Ordine (IdCarrello, IdUtente, IdProdotto, Quantita, PrezzoUnitario) VALUES
(1, 1, 1, 4, 0.50),   -- 4 Mele
(1, 1, 3, 2, 1.20),   -- 2 Pasta
(1, 1, 6, 1, 2.50);   -- 1 Uova

-- Ordini per il carrello non pagato (IdCarrello = 2)
INSERT INTO Ordine (IdCarrello, IdUtente, IdProdotto, Quantita, PrezzoUnitario) VALUES
(2, 2, 2, 3, 0.70),   -- 3 Banane
(2, 2, 4, 2, 1.00),   -- 2 Pane
(2, 2, 5, 1, 1.30);   -- 1 Latte
