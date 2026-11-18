var LIBELLES = { en_cours: 'En cours', a_venir: 'À venir', terminee: 'Terminée' };

function afficherMessage(texte, succes) {
    var msg = document.getElementById('message-annulation');
    msg.textContent = texte;
    msg.className = 'message ' + (succes ? 'succes' : 'erreur');
}

var modalFond = document.getElementById('modal-fond');
var reservationAAnnuler = null;

function fermerModal() {
    modalFond.classList.add('cache');
    reservationAAnnuler = null;
}

function annuler(id, numero) {
    reservationAAnnuler = id;
    document.getElementById('modal-texte').textContent =
        'La réservation de la place ' + numero + ' sera supprimée.';
    modalFond.classList.remove('cache');
}

function confirmerAnnulation() {
    var id = reservationAAnnuler;
    fermerModal();
    if (id === null) { return; }

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

document.getElementById('modal-oui').addEventListener('click', confirmerAnnulation);
document.getElementById('modal-non').addEventListener('click', fermerModal);
modalFond.addEventListener('click', function (e) {
    if (e.target === modalFond) { fermerModal(); }     // clic en dehors de la fenêtre
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { fermerModal(); }
});

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