<?php
$titre = 'Mes réservations';
$scripts = ['commun.js', 'mes_reservations.js'];
require __DIR__ . '/../layouts/header.php';
require __DIR__ . '/../layouts/navbar.php';
?>

<main class="mes-reservations">
    <section class="carte">
        <h1>Mes réservations</h1>
        <p id="message-annulation" class="message"></p>
        <div id="tableau-reservations"></div>
    </section>
</main>
<div id="modal-fond" class="modal-fond cache">
    <div class="modal carte" role="dialog" aria-modal="true" aria-labelledby="modal-titre">
        <h2 id="modal-titre">Annuler la réservation ?</h2>
        <p id="modal-texte" class="modal-texte"></p>
        <div class="modal-actions">
            <button type="button" id="modal-non" class="btn-secondaire">Garder</button>
            <button type="button" id="modal-oui" class="btn-danger">Oui, annuler</button>
        </div>
    </div>
</div>
<?php require __DIR__ . '/../layouts/footer.php'; ?>