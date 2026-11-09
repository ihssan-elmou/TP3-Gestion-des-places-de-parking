<?php
require_once __DIR__ . '/../Traitement/Outils.php';
require_once __DIR__ . '/../Traitement/Reservation.php';

exigerConnexion(true);

try {
    repondreJson([
        'success'      => true,
        'reservations' => ReservationTraitement::mesReservations((int) $_SESSION['utilisateur_id'])
    ]);
} catch (Throwable $e) {
    repondreJson(['success' => false, 'message' => 'Erreur serveur'], 500);
}