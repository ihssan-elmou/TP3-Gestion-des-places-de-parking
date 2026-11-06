<?php
require_once __DIR__ . '/../Traitement/Outils.php';
require_once __DIR__ . '/../Traitement/Place.php';

exigerConnexion(true);

try {
    // Avec ?place_id=3 : les prochaines réservations de cette place
    if (isset($_GET['place_id'])) {
        $placeId = (int) $_GET['place_id'];
        repondreJson([
            'success'      => true,
            'reservations' => PlaceTraitement::prochaines($placeId)
        ]);
    }

    // Sans paramètre : toutes les places avec leur état
    repondreJson([
        'success' => true,
        'places'  => PlaceTraitement::lister()
    ]);
} catch (Throwable $e) {
    repondreJson(['success' => false, 'message' => 'Erreur serveur'], 500);
}