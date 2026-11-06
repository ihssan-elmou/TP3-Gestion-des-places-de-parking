<?php
$titre = 'Parking';
$scripts = ['parking.js', 'reservation.js', 'notification.js'];
require __DIR__ . '/../layouts/header.php';
require __DIR__ . '/../layouts/navbar.php';
?>

<div id="notification" class="notification"></div>

<main class="parking">
    <h1>Places de parking</h1>

    <p class="legende">
        <span class="pastille libre"></span> Libre
        <span class="pastille occupee"></span> Occupée
    </p>

    <div id="grille-places" class="grille"></div>

    <?php require __DIR__ . '/reservation.php'; ?>
</main>

<?php require __DIR__ . '/../layouts/footer.php'; ?>