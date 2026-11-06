function pad(n) { return n < 10 ? '0' + n : n; }

function dateLocale(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
function heureLocale(d) {
    return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

// Valeurs par défaut : arrivée à la prochaine heure pleine, départ 1 h plus tard
function initialiserChamps() {
    var maintenant = new Date();
    var debut = new Date(maintenant.getTime());
    debut.setHours(debut.getHours() + 1, 0, 0, 0);
    var fin = new Date(debut.getTime() + 3600000);

    var champDate = document.getElementById('date_res');
    champDate.min = dateLocale(maintenant);
    champDate.value = dateLocale(debut);

    document.getElementById('h_debut').value = heureLocale(debut);
    document.getElementById('h_fin').value =
        (dateLocale(fin) === dateLocale(debut)) ? heureLocale(fin) : '23:59';
}

initialiserChamps();

document.getElementById('form-reservation').addEventListener('submit', function (e) {
    e.preventDefault();

    var msg = document.getElementById('message-reservation');
    var date = document.getElementById('date_res').value;

    // On recompose le format attendu par le serveur : 2026-11-06T16:00
    var debut = date + 'T' + document.getElementById('h_debut').value;
    var fin   = date + 'T' + document.getElementById('h_fin').value;

    var donnees =
        'place_id=' + encodeURIComponent(document.getElementById('place_id').value) +
        '&heure_debut=' + encodeURIComponent(debut) +
        '&heure_fin=' + encodeURIComponent(fin);

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