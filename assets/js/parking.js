var placeSelectionneeId = null;

// Fonction XMLHttpRequest réutilisable (utilisée aussi par les autres fichiers JS)
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

function chargerPlaces() {
    ajax('GET', 'ajax/get_places.php', null, function (rep) {
        if (!rep || !rep.success) { return; }

        var grille = document.getElementById('grille-places');
        grille.innerHTML = '';

        rep.places.forEach(function (p) {
            var id = parseInt(p.id, 10);

            var carte = document.createElement('div');
            carte.className = 'place ' + p.etat;
            if (id === placeSelectionneeId) { carte.className += ' selectionnee'; }

            var numero = document.createElement('strong');
            numero.textContent = p.numero;

            var etat = document.createElement('span');
            etat.textContent = (p.etat === 'libre')
                ? 'Libre'
                : "Occupée jusqu'à " + p.libre_a_partir_de.substring(11, 16);

            carte.appendChild(numero);
            carte.appendChild(etat);
            carte.addEventListener('click', function () {
                selectionnerPlace(id, p.numero);
            });
            grille.appendChild(carte);
        });
    });
}

function selectionnerPlace(id, numero) {
    placeSelectionneeId = id;
    document.getElementById('place_id').value = id;
    document.getElementById('place-numero').textContent = numero;
    document.getElementById('aide-selection').classList.add('cache');
    document.getElementById('panneau-reservation').classList.remove('cache');

    var msg = document.getElementById('message-reservation');
    msg.textContent = '';
    msg.className = 'message';

    chargerReservationsPlace();
    chargerPlaces();
}

function chargerReservationsPlace() {
    if (placeSelectionneeId === null) { return; }

    ajax('GET', 'ajax/get_places.php?place_id=' + placeSelectionneeId, null, function (rep) {
        if (!rep || !rep.success) { return; }

        var liste = document.getElementById('liste-reservations');
        liste.innerHTML = '';

        if (rep.reservations.length === 0) {
            var vide = document.createElement('li');
            vide.textContent = 'Aucune réservation à venir';
            liste.appendChild(vide);
            return;
        }

        rep.reservations.forEach(function (r) {
            var li = document.createElement('li');
            li.textContent = formatHeure(r.heure_debut) + ' → ' + formatHeure(r.heure_fin);
            liste.appendChild(li);
        });
    });
}

// Démarrage + rafraîchissement automatique toutes les 3 secondes
chargerPlaces();
setInterval(function () {
    chargerPlaces();
    chargerReservationsPlace();
}, 3000);