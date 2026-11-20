// ============================================================
// commun.js : fonctions partagées par toutes les pages
// (chargé en premier dans dashboard.php et mes_reservations.php)
// ============================================================

function pad(n) { return n < 10 ? '0' + n : n; }

// ------------------------------------------------------------
// ajax() : envoie une requête HTTP avec XMLHttpRequest, sans recharger la page
// Paramètres :
//   methode  : 'GET' (lire) ou 'POST' (envoyer des données)
//   url      : fichier PHP à appeler, ex. 'ajax/get_places.php'
//   donnees  : données du POST, ex. 'place_id=2&heure_debut=...' (null pour un GET)
//   callback : fonction exécutée quand la réponse arrive ; elle reçoit
//              la réponse JSON déjà convertie en objet (ou null en cas d'erreur)
// ------------------------------------------------------------
function ajax(methode, url, donnees, callback) {

    // 1. Création de l'objet fourni par le navigateur pour envoyer la requête
    var objetXHR = new XMLHttpRequest();

    // 2. Préparation (rien n'est encore envoyé)
    //    3e paramètre true = requête ASYNCHRONE : la page reste utilisable pendant l'attente
    objetXHR.open(methode, url, true);

    // 3. Fonction de rappel : appelée à chaque changement de l'état de la requête
    //    (readyState passe de 1 à 4)
    objetXHR.onreadystatechange = function actualiserPage() {

        // readyState 4 = la réponse du serveur est complète
        if (objetXHR.readyState === 4) {

            // Code HTTP 401 = non connecté (session expirée) : retour à la page de connexion
            if (objetXHR.status === 401) {
                window.location.href = 'index.php?action=login';
                return;
            }

            // La réponse du serveur est du TEXTE (responseText) au format JSON.
            // JSON.parse le transforme en objet JavaScript utilisable (ex. reponse.places).
            // try/catch : si le texte n'est pas du JSON valide (erreur PHP, par exemple),
            // l'erreur est ignorée et reponse reste null au lieu de bloquer le script.
            var reponse = null;
            try { reponse = JSON.parse(objetXHR.responseText); } catch (e) {}

            // On donne la réponse à la fonction passée en 4e paramètre
            callback(reponse);
        }
    };

    // 4. Envoi de la requête
    if (methode === 'POST') {
        // En-tête obligatoire pour que PHP remplisse $_POST avec les données
        objetXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        objetXHR.send(donnees);     // POST : les données sont dans le corps de la requête
    } else {
        objetXHR.send(null);        // GET : pas de corps (les paramètres sont dans l'URL)
    }
}

// Transforme une date SQL en affichage court

function formatHeure(dt) {
    return dt.substring(8, 10) + '/' + dt.substring(5, 7) + ' ' + dt.substring(11, 16);
}