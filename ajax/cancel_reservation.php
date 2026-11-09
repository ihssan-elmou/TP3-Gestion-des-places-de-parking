<?php
require_once __DIR__ . '/../Traitement/Outils.php';
require_once __DIR__ . '/../Traitement/Reservation.php';

exigerConnexion(true);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    repondreJson(['success' => false, 'message' => 'Méthode non autorisée'], 405);
}

try {
    $resultat = ReservationTraitement::annuler((int) $_SESSION['utilisateur_id'], $_POST);

    repondreJson(
        ['success' => $resultat['ok'], 'message' => $resultat['message']],
        $resultat['ok'] ? 200 : 400
    );
} catch (Throwable $e) {
    repondreJson(['success' => false, 'message' => 'Erreur serveur'], 500);
}