<?php
require_once __DIR__ . '/Connexion.php';

class Reservation
{
    public static function chevauche(mysqli $conn, int $placeId, string $debut, string $fin): bool
    {
        $stmt = $conn->prepare(
            "SELECT id FROM reservations
             WHERE place_id = ? AND ? < heure_fin AND ? > heure_debut
             LIMIT 1"
        );
        $stmt->bind_param("iss", $placeId, $debut, $fin);
        $stmt->execute();
        return $stmt->get_result()->num_rows > 0;
    }

    public static function creer(int $userId, int $placeId, string $debut, string $fin): array
    {
        $conn = getConnexion();
        $conn->begin_transaction();

        try {
            // Verrouille la place : deux réservations simultanées passent l'une après l'autre
            $stmt = $conn->prepare("SELECT id FROM places WHERE id = ? FOR UPDATE");
            $stmt->bind_param("i", $placeId);
            $stmt->execute();
            if ($stmt->get_result()->num_rows === 0) {
                $conn->rollback();
                return ['ok' => false, 'message' => 'Place introuvable'];
            }

            if (self::chevauche($conn, $placeId, $debut, $fin)) {
                $conn->rollback();
                return ['ok' => false, 'message' => 'Place déjà réservée sur ce créneau'];
            }

            $stmt = $conn->prepare(
                "INSERT INTO reservations (utilisateur_id, place_id, heure_debut, heure_fin)
                 VALUES (?, ?, ?, ?)"
            );
            $stmt->bind_param("iiss", $userId, $placeId, $debut, $fin);
            $stmt->execute();

            $conn->commit();
            return ['ok' => true, 'message' => 'Réservation effectuée'];
        } catch (Throwable $e) {
            $conn->rollback();
            return ['ok' => false, 'message' => 'Erreur serveur'];
        }
    }

    public static function derniereId(): int
    {
        $conn = getConnexion();
        $res = $conn->query("SELECT COALESCE(MAX(id), 0) AS m FROM reservations");
        return (int) $res->fetch_assoc()['m'];
    }

    public static function nouvellesDepuis(int $idConnu): array
    {
        $conn = getConnexion();
        $stmt = $conn->prepare(
            "SELECT r.id, p.numero, u.nom, r.heure_debut, r.heure_fin
             FROM reservations r
             JOIN places p ON p.id = r.place_id
             JOIN utilisateurs u ON u.id = r.utilisateur_id
             WHERE r.id > ?
             ORDER BY r.id"
        );
        $stmt->bind_param("i", $idConnu);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

        public static function parUtilisateur(int $userId): array
    {
        $conn = getConnexion();
        $stmt = $conn->prepare(
            "SELECT r.id, p.numero, r.heure_debut, r.heure_fin
             FROM reservations r
             JOIN places p ON p.id = r.place_id
             WHERE r.utilisateur_id = ?
             ORDER BY r.heure_debut DESC"
        );
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public static function annuler(int $id, int $userId, string $maintenant): bool
    {
        $conn = getConnexion();
        $stmt = $conn->prepare(
            "DELETE FROM reservations
             WHERE id = ? AND utilisateur_id = ? AND heure_fin > ?"
        );
        $stmt->bind_param("iis", $id, $userId, $maintenant);
        $stmt->execute();
        return $stmt->affected_rows > 0;
    }
}