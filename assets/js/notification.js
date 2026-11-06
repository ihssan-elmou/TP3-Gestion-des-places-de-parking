var derniereId = null;          // null = premier appel
var historique = [];            // notifications gardées dans la cloche
var nonLues = 0;
var utilisateur = document.getElementById('app').getAttribute('data-user');

var ICONE_OK =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" ' +
    'stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>';

/* ---------- Message en bas à gauche (style Gmail) ---------- */
function fermerToast(toast) {
    toast.classList.add('sortie');
    setTimeout(function () {
        if (toast.parentNode) { toast.parentNode.removeChild(toast); }
    }, 300);
}

function afficherToast(titre, texte) {
    var toast = document.createElement('div');
    toast.className = 'toast';

    var icone = document.createElement('span');
    icone.className = 'toast-icone';
    icone.innerHTML = ICONE_OK;     // SVG fixe

    var corps = document.createElement('div');
    corps.className = 'toast-corps';
    var t = document.createElement('strong');
    t.textContent = titre;
    var p = document.createElement('p');
    p.textContent = texte;
    corps.appendChild(t);
    corps.appendChild(p);

    var fermer = document.createElement('button');
    fermer.type = 'button';
    fermer.className = 'toast-fermer';
    fermer.setAttribute('aria-label', 'Fermer');
    fermer.textContent = '×';
    fermer.addEventListener('click', function () { fermerToast(toast); });

    toast.appendChild(icone);
    toast.appendChild(corps);
    toast.appendChild(fermer);
    document.getElementById('toasts').appendChild(toast);

    setTimeout(function () { fermerToast(toast); }, 6000);
}

/* ---------- Cloche et historique ---------- */
function majBadge() {
    var badge = document.getElementById('badge-notif');
    badge.textContent = nonLues;
    badge.classList.toggle('cache', nonLues === 0);
}

function dessinerHistorique() {
    var liste = document.getElementById('liste-notifs');
    liste.innerHTML = '';

    if (historique.length === 0) {
        var vide = document.createElement('li');
        vide.className = 'vide';
        vide.textContent = 'Aucune notification';
        liste.appendChild(vide);
        return;
    }

    historique.forEach(function (n) {
        var li = document.createElement('li');
        var t = document.createElement('strong');
        t.textContent = n.titre;
        var p = document.createElement('div');
        p.textContent = n.texte;
        var h = document.createElement('small');
        h.textContent = n.heure;
        li.appendChild(t);
        li.appendChild(p);
        li.appendChild(h);
        liste.appendChild(li);
    });
}

function ajouterHistorique(titre, texte, estMoi) {
    var d = new Date();
    historique.unshift({
        titre: titre,
        texte: texte,
        heure: pad(d.getHours()) + ':' + pad(d.getMinutes())
    });
    if (historique.length > 20) { historique.pop(); }
    if (!estMoi) { nonLues++; }
    majBadge();
    dessinerHistorique();
}

var panneau = document.getElementById('panneau-notifs');

document.getElementById('cloche').addEventListener('click', function (e) {
    e.stopPropagation();
    panneau.classList.toggle('cache');
    if (!panneau.classList.contains('cache')) {
        nonLues = 0;
        majBadge();
    }
});
document.addEventListener('click', function (e) {
    if (!panneau.contains(e.target)) { panneau.classList.add('cache'); }
});

/* ---------- Polling toutes les 3 secondes ---------- */
function verifierNotifications() {
    var url = 'ajax/get_notifications.php';
    if (derniereId !== null) { url += '?since=' + derniereId; }

    ajax('GET', url, null, function (rep) {
        if (!rep || !rep.success) { return; }

        derniereId = rep.derniere_id;

        rep.nouvelles.forEach(function (n) {
            var estMoi = (n.nom === utilisateur);
            var titre = estMoi ? 'Réservation confirmée' : 'Nouvelle réservation';
            var texte = (estMoi ? 'Tu as réservé' : n.nom + ' a réservé')
                + ' la place ' + n.numero + ' · '
                + formatHeure(n.heure_debut) + ' → ' + formatHeure(n.heure_fin);

            afficherToast(titre, texte);
            ajouterHistorique(titre, texte, estMoi);
        });

        if (rep.nouvelles.length > 0) { chargerPlaces(); }
    });
}

verifierNotifications();
setInterval(verifierNotifications, 3000);