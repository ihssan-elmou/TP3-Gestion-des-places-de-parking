var LIBELLES = { en_cours: 'En cours', a_venir: 'À venir', terminee: 'Terminée' };

// Requête XMLHttpRequest (cette page ne charge pas parking.js)
function ajax(methode, url, donnees, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(methode, url, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) { return; }

        if (xhr.status === 401) {
            window.location.href = 'index.php?action=login';
            return;
        }

        var reponse = null;
        try { reponse = JSON.parse(xhr.responseText); } catch (e) {}
        callback(reponse);
    };

    if (methode === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(donnees);
    } else {
        xhr.send();
    }
}

// "2026-11-05 16:00:00" -> "05/11 16:00"
function formatHeure(dt) {
    return dt.substring(8, 10) + '/' + dt.substring(5, 7) + ' ' + dt.substring(11, 16);
}

function afficherMessage(texte, succes) {
    var msg = document.getElementById('message-annulation');
    msg.textContent = texte;
    msg.className = 'message ' + (succes ? 'succes' : 'erreur');
}

function annuler(id, numero) {
    if (!confirm('Annuler la réservation de la place ' + numero + ' ?')) { return; }

    ajax('POST', 'ajax/cancel_reservation.php',
        'reservation_id=' + encodeURIComponent(id),
        function (rep) {
            if (!rep) {
                afficherMessage('Erreur de communication avec le serveur', false);
                return;
            }
            afficherMessage(rep.message, rep.success);
            chargerMesReservations();
        });
}

function dessinerTableau(liste) {
    var conteneur = document.getElementById('tableau-reservations');
    conteneur.innerHTML = '';

    if (liste.length === 0) {
        var vide = document.createElement('p');
        vide.className = 'aide';
        vide.textContent = "Tu n'as encore aucune réservation.";
        conteneur.appendChild(vide);
        return;
    }

    var table = document.createElement('table');
    table.className = 'table-res';

    var entete = document.createElement('tr');
    ['Place', 'Début', 'Fin', 'Statut', ''].forEach(function (titre) {
        var th = document.createElement('th');
        th.textContent = titre;
        entete.appendChild(th);
    });
    table.appendChild(entete);

    liste.forEach(function (r) {
        var tr = document.createElement('tr');

        var cellules = [
            r.numero,
            formatHeure(r.heure_debut),
            formatHeure(r.heure_fin)
        ];
        cellules.forEach(function (texte) {
            var td = document.createElement('td');
            td.textContent = texte;
            tr.appendChild(td);
        });

        var tdStatut = document.createElement('td');
        var badge = document.createElement('span');
        badge.className = 'statut ' + r.statut;
        badge.textContent = LIBELLES[r.statut];
        tdStatut.appendChild(badge);
        tr.appendChild(tdStatut);

        var tdAction = document.createElement('td');
        if (r.statut !== 'terminee') {
            var bouton = document.createElement('button');
            bouton.type = 'button';
            bouton.className = 'btn-annuler';
            bouton.textContent = 'Annuler';
            bouton.addEventListener('click', function () {
                annuler(r.id, r.numero);
            });
            tdAction.appendChild(bouton);
        }
        tr.appendChild(tdAction);

        table.appendChild(tr);
    });

    conteneur.appendChild(table);
}

function chargerMesReservations() {
    ajax('GET', 'ajax/get_mes_reservations.php', null, function (rep) {
        if (!rep || !rep.success) { return; }
        dessinerTableau(rep.reservations);
    });
}

chargerMesReservations();
setInterval(chargerMesReservations, 10000);