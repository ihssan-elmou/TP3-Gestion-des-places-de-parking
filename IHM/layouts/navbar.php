<nav class="navbar">
    <span class="logo">🅿 Parking</span>
    <?php if (estConnecte()): ?>
        <span class="user">
            Bonjour <?= htmlspecialchars($_SESSION['utilisateur_nom']) ?>
            <a href="index.php?action=logout" class="btn-logout">Déconnexion</a>
        </span>
    <?php endif; ?>
</nav>