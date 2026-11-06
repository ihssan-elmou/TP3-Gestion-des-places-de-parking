<?php
require_once __DIR__ . '/Connexion.php';

class Utilisateur
{
    public static function trouverParEmail(string $email): ?array
    {
        $conn = getConnexion();
        $stmt = $conn->prepare(
            "SELECT id, nom, email, mot_de_passe FROM utilisateurs WHERE email = ?"
        );
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $ligne = $stmt->get_result()->fetch_assoc();
        return $ligne ?: null;
    }

    public static function creer(string $nom, string $email, string $hash): bool
    {
        $conn = getConnexion();
        $stmt = $conn->prepare(
            "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)"
        );
        $stmt->bind_param("sss", $nom, $email, $hash);
        return $stmt->execute();
    }
}