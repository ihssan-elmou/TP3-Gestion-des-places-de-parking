<?php
$titre = 'Parking';
$scripts = ['parking.js', 'reservation.js', 'notification.js'];
require __DIR__ . '/../layouts/header.php';
require __DIR__ . '/../layouts/navbar.php';
?>

<div id="app" data-user="<?= htmlspecialchars($_SESSION['utilisateur_nom']) ?>"></div>
<div id="toasts" class="toasts"></div>

<main class="dashboard">
    <section class="carte">
        <div class="carte-entete">
            <h1>Places de parking</h1>
            <p class="legende">
                <span class="pastille libre"></span> Libre
                <span class="pastille occupee"></span> Occupée
            </p>
        </div>

        <div id="zones" class="zones"></div>
        <div id="grille-places" class="grille"></div>
    </section>

    <aside class="colonne-droite">
        <section class="carte">
            <h2>Aperçu</h2>
            <div class="stats">
                <div><strong id="stat-libres">0</strong><span>Libres</span></div>
                <div><strong id="stat-occupees">0</strong><span>Occupées</span></div>
            </div>
        </section>

        <?php require __DIR__ . '/reservation.php'; ?>
    </aside>
</main>

<?php require __DIR__ . '/../layouts/footer.php'; ?>