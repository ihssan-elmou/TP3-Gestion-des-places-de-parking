function pad(n) { return n < 10 ? '0' + n : n; }

// Date JS -> format du champ datetime-local : 2026-11-05T16:00
function versChampDate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
        + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

// Valeurs par défaut : début à la prochaine heure pleine, fin 1 h plus tard
function initialiserChamps() {
    var maintenant = new Date();
    var debut = new Date(maintenant.getTime());
    debut.setHours(debut.getHours() + 1, 0, 0, 0);
    var fin = new Date(debut.getTime() + 3600000);

    var champDebut = document.getElementById('heure_debut');
    champDebut.min = versChampDate(maintenant);
    champDebut.value = versChampDate(debut);
    document.getElementById('heure_fin').value = versChampDate(fin);
}

initialiserChamps();

document.getElementById('form-reservation').addEventListener('submit', function (e) {
    e.preventDefault();

    var msg = document.getElementById('message-reservation');

    var donnees =
        'place_id=' + encodeURIComponent(document.getElementById('place_id').value) +
        '&heure_debut=' + encodeURIComponent(document.getElementById('heure_debut').value) +
        '&heure_fin=' + encodeURIComponent(document.getElementById('heure_fin').value);

    ajax('POST', 'ajax/create_reservation.php', donnees, function (rep) {
        if (!rep) {
            msg.textContent = 'Erreur de communication avec le serveur';
            msg.className = 'message erreur';
            return;
        }

        msg.textContent = rep.message;
        msg.className = 'message ' + (rep.success ? 'succes' : 'erreur');

        if (rep.success) {
            chargerPlaces();
            chargerReservationsPlace();
        }
    });
});