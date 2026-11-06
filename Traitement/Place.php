<?php
require_once __DIR__ . '/Outils.php';
require_once __DIR__ . '/../BD/Place.php';

class PlaceTraitement
{
    public static function lister(): array
    {
        $maintenant = date('Y-m-d H:i:s');
        return Place::toutesAvecEtat($maintenant);
    }

    public static function prochaines(int $placeId): array
    {
        $maintenant = date('Y-m-d H:i:s');
        return Place::prochainesReservations($placeId, $maintenant);
    }
}