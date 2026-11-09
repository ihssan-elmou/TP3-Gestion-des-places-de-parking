<?php
$titre = 'Mes réservations';
$scripts = ['mes_reservations.js'];
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

<?php require __DIR__ . '/../layouts/footer.php'; ?>