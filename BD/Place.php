<?php
require_once __DIR__ . '/Connexion.php';

class Place
{
    public static function toutesAvecEtat(string $maintenant): array
    {
        $conn = getConnexion();
        $stmt = $conn->prepare(
            "SELECT p.id, p.numero, r.heure_fin AS libre_a_partir_de
             FROM places p
             LEFT JOIN reservations r
               ON r.place_id = p.id
              AND r.heure_debut <= ?
              AND r.heure_fin > ?
             ORDER BY p.numero"
        );
        $stmt->bind_param("ss", $maintenant, $maintenant);
        $stmt->execute();
        $lignes = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

        foreach ($lignes as &$l) {
            $l['etat'] = $l['libre_a_partir_de'] ? 'occupee' : 'libre';
        }
        return $lignes;
    }

    public static function prochainesReservations(int $placeId, string $maintenant): array
    {
        $conn = getConnexion();
        $stmt = $conn->prepare(
            "SELECT heure_debut, heure_fin
             FROM reservations
             WHERE place_id = ? AND heure_fin > ?
             ORDER BY heure_debut"
        );
        $stmt->bind_param("is", $placeId, $maintenant);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}