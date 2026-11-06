CREATE DATABASE IF NOT EXISTS parking
  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE parking;

CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  utilisateur_id INT NOT NULL,
  place_id INT NOT NULL,
  heure_debut DATETIME NOT NULL,
  heure_fin DATETIME NOT NULL,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  INDEX idx_place_creneau (place_id, heure_debut, heure_fin)
) ENGINE=InnoDB;

INSERT INTO places (numero) VALUES
('A1'), ('A2'), ('A3'), ('A4'),
('B1'), ('B2'), ('B3'), ('B4');