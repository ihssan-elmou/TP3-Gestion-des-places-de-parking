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

    var champDateFin = document.getElementById('date_fin');
    champDateFin.min = dateLocale(debut);
    champDateFin.value = dateLocale(fin);

    document.getElementById('h_debut').value = heureLocale(debut);
    document.getElementById('h_fin').value = heureLocale(fin);
}

initialiserChamps();

// La date de départ ne peut pas être avant la date d'arrivée
document.getElementById('date_res').addEventListener('change', function () {
    var dFin = document.getElementById('date_fin');
    dFin.min = this.value;
    if (dFin.value < this.value) { dFin.value = this.value; }
});

document.getElementById('form-reservation').addEventListener('submit', function (e) {
    e.preventDefault();

    var msg = document.getElementById('message-reservation');

    // On recompose le format attendu par le serveur : 2026-11-06T16:00
    var debut = document.getElementById('date_res').value + 'T' + document.getElementById('h_debut').value;
    var fin   = document.getElementById('date_fin').value + 'T' + document.getElementById('h_fin').value;

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