<?php
require_once __DIR__ . '/Outils.php';
require_once __DIR__ . '/../BD/Reservation.php';

// $since = null : premier appel, on mémorise seulement le dernier id
function notifications_depuis(?int $since): array
{
    if ($since === null) {
        return [
            'derniere_id' => bd_derniere_id(),
            'nouvelles'   => []
        ];
    }

    $nouvelles = bd_nouvelles_depuis($since);
    $derniere  = $since;
    foreach ($nouvelles as $n) {
        if ((int) $n['id'] > $derniere) {
            $derniere = (int) $n['id'];
        }
    }

    return [
        'derniere_id' => $derniere,
        'nouvelles'   => $nouvelles
    ];
}
