<?php
require_once __DIR__ . '/Outils.php';
require_once __DIR__ . '/../BD/Reservation.php';

class ReservationTraitement
{
    public static function reserver(int $userId, array $post): array
    {
        $placeId = (int) ($post['place_id'] ?? 0);
        $debutBr = nettoyer($post['heure_debut'] ?? '');
        $finBr   = nettoyer($post['heure_fin'] ?? '');

        // 1. Champs obligatoires
        if ($placeId <= 0 || $debutBr === '' || $finBr === '') {
            return ['ok' => false, 'message' => 'Tous les champs sont obligatoires'];
        }

        // 2. Dates valides
        $tDebut = strtotime($debutBr);
        $tFin   = strtotime($finBr);
        if ($tDebut === false || $tFin === false) {
            return ['ok' => false, 'message' => 'Date ou heure invalide'];
        }

        // 3. Fin après début (R2)
        if ($tFin <= $tDebut) {
            return ['ok' => false, 'message' => "L'heure de fin doit être après l'heure de début"];
        }

        // 4. Début pas dans le passé (R3), avec 60 s de tolérance
        if ($tDebut < time() - 60) {
            return ['ok' => false, 'message' => 'Le début ne peut pas être dans le passé'];
        }

        // 5. Enregistrement (vérifie le chevauchement dans la transaction)
        return Reservation::creer(
            $userId,
            $placeId,
            date('Y-m-d H:i:s', $tDebut),
            date('Y-m-d H:i:s', $tFin)
        );
    }
}