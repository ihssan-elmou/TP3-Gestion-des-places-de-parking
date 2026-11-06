var derniereId = null;      // null = premier appel
var minuteurBandeau = null;

function afficherNotification(texte) {
    var bandeau = document.getElementById('notification');
    bandeau.textContent = texte;
    bandeau.classList.add('visible');

    clearTimeout(minuteurBandeau);
    minuteurBandeau = setTimeout(function () {
        bandeau.classList.remove('visible');
    }, 5000);
}

function verifierNotifications() {
    var url = 'ajax/get_notifications.php';
    if (derniereId !== null) { url += '?since=' + derniereId; }

    ajax('GET', url, null, function (rep) {
        if (!rep || !rep.success) { return; }

        derniereId = rep.derniere_id;

        if (rep.nouvelles.length > 0) {
            var textes = rep.nouvelles.map(function (n) {
                return "La place " + n.numero + " vient d'être réservée ("
                    + formatHeure(n.heure_debut) + ' → ' + formatHeure(n.heure_fin) + ')';
            });
            afficherNotification(textes.join(' | '));
            chargerPlaces();
        }
    });
}

verifierNotifications();
setInterval(verifierNotifications, 3000);