function pad(n) { return n < 10 ? '0' + n : n; }

// Fonction XMLHttpRequest réutilisable par tous les fichiers JS
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