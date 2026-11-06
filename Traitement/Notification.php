<?php
require_once __DIR__ . '/Outils.php';
require_once __DIR__ . '/../BD/Reservation.php';

class NotificationTraitement
{
    // $since = null : premier appel, on mémorise seulement le dernier id
    public static function depuis(?int $since): array
    {
        if ($since === null) {
            return [
                'derniere_id' => Reservation::derniereId(),
                'nouvelles'   => []
            ];
        }

        $nouvelles = Reservation::nouvellesDepuis($since);
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
}