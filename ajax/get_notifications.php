<?php
require_once __DIR__ . '/../Traitement/Outils.php';
require_once __DIR__ . '/../Traitement/Notification.php';

exigerConnexion(true);

try {
    // Premier appel : pas de "since" -> on mémorise seulement le dernier id
    $since = isset($_GET['since']) ? (int) $_GET['since'] : null;

    $data = NotificationTraitement::depuis($since);

    repondreJson([
        'success'     => true,
        'derniere_id' => $data['derniere_id'],
        'nouvelles'   => $data['nouvelles']
    ]);
} catch (Throwable $e) {
    repondreJson(['success' => false, 'message' => 'Erreur serveur'], 500);
}