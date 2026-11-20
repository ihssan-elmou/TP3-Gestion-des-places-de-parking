<?php
require_once __DIR__ . '/Outils.php';
require_once __DIR__ . '/../BD/Place.php';

function lister_places(): array
{
    $maintenant = date('Y-m-d H:i:s');
    return bd_places_avec_etat($maintenant);
}

function prochaines_reservations(int $placeId): array
{
    $maintenant = date('Y-m-d H:i:s');
    return bd_prochaines_reservations($placeId, $maintenant);
}
