var placeSelectionneeId = null;
var placesCache = [];
var zoneActive = null;

// Voiture vue de dessus (affichée sur les places occupées)
var ICONE_VOITURE =
    '<svg viewBox="0 0 40 72" aria-hidden="true">' +
    '<rect x="2" y="12" width="5" height="9" rx="2" fill="#4b5563"/>' +
    '<rect x="33" y="12" width="5" height="9" rx="2" fill="#4b5563"/>' +
    '<rect x="6" y="2" width="28" height="68" rx="13" fill="#374151"/>' +
    '<rect x="11" y="16" width="18" height="13" rx="4" fill="#9fb3c0"/>' +
    '<rect x="11" y="45" width="18" height="10" rx="3" fill="#9fb3c0"/>' +
    '</svg>';

// Fonction XMLHttpRequest réutilisable (utilisée aussi par les autres fichiers JS)
function ajax(methode, url, donnees, callback) {
    var objetXHR = new XMLHttpRequest();
    objetXHR.open(methode, url, true);

    // Fonction de rappel, nommée comme dans le cours
    objetXHR.onreadystatechange = function actualiserPage() {
        if (objetXHR.readyState === 4) {
            if (objetXHR.status === 401) {          // session expirée
                window.location.href = 'index.php?action=login';
                return;
            }
            var reponse = null;
            try { reponse = JSON.parse(objetXHR.responseText); } catch (e) {}
            callback(reponse);
        }
    };

    if (methode === 'POST') {
        objetXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        objetXHR.send(donnees);
    } else {
        objetXHR.send(null);
    }
}

// "2026-11-05 16:00:00" -> "05/11 16:00"
function formatHeure(dt) {
    return dt.substring(8, 10) + '/' + dt.substring(5, 7) + ' ' + dt.substring(11, 16);
}

function zoneDe(numero) {
    return numero.charAt(0).toUpperCase();
}

function dessinerZones() {
    var conteneur = document.getElementById('zones');
    conteneur.innerHTML = '';

    var zones = [];
    placesCache.forEach(function (p) {
        var z = zoneDe(p.numero);
        if (zones.indexOf(z) === -1) { zones.push(z); }
    });
    zones.sort();

    if (zoneActive === null || zones.indexOf(zoneActive) === -1) {
        zoneActive = zones[0];
    }

    zones.forEach(function (z) {
        var bouton = document.createElement('button');
        bouton.type = 'button';
        bouton.className = 'zone-pill' + (z === zoneActive ? ' active' : '');
        bouton.textContent = 'Zone ' + z;
        bouton.addEventListener('click', function () {
            zoneActive = z;
            dessinerZones();
            dessinerGrille();
        });
        conteneur.appendChild(bouton);
    });
}

function dessinerGrille() {
    var grille = document.getElementById('grille-places');
    grille.innerHTML = '';

    placesCache.forEach(function (p) {
        if (zoneDe(p.numero) !== zoneActive) { return; }

        var id = parseInt(p.id, 10);
        var carte = document.createElement('div');
        carte.className = 'place ' + p.etat + (id === placeSelectionneeId ? ' selectionnee' : '');

        if (p.etat === 'occupee') {
            var voiture = document.createElement('span');
            voiture.className = 'voiture';
            voiture.innerHTML = ICONE_VOITURE;   // SVG fixe, aucune donnée utilisateur
            carte.appendChild(voiture);
        }

        var num = document.createElement('span');
        num.className = 'num';
        num.textContent = p.numero;

        var info = document.createElement('span');
        info.className = 'info';
        info.textContent = (p.etat === 'libre')
            ? 'Libre'
            : "Jusqu'à " + p.libre_a_partir_de.substring(11, 16);

        carte.appendChild(num);
        carte.appendChild(info);
        carte.addEventListener('click', function () {
            selectionnerPlace(id, p.numero);
        });
        grille.appendChild(carte);
    });
}

function majStats() {
    var libres = 0;
    placesCache.forEach(function (p) { if (p.etat === 'libre') { libres++; } });
    document.getElementById('stat-libres').textContent = libres;
    document.getElementById('stat-occupees').textContent = placesCache.length - libres;
}

function chargerPlaces() {
    ajax('GET', 'ajax/get_places.php', null, function (rep) {
        if (!rep || !rep.success) { return; }
        placesCache = rep.places;
        dessinerZones();
        dessinerGrille();
        majStats();
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

    dessinerGrille();
    chargerReservationsPlace();
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