<header class="topbar">
    <div class="brand"><span class="brand-icone">P</span> Parking</div>

    <?php if (estConnecte()): ?>
        <nav class="pill">
            <a class="actif" href="index.php?action=parking">Dashboard</a>
        </nav>

        <div class="topbar-droite">
            <div class="cloche-zone">
                <button type="button" id="cloche" class="icone-btn" aria-label="Notifications">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
                    </svg>
                    <span id="badge-notif" class="badge cache">0</span>
                </button>

                <div id="panneau-notifs" class="dropdown cache">
                    <div class="dropdown-titre">Notifications</div>
                    <ul id="liste-notifs">
                        <li class="vide">Aucune notification</li>
                    </ul>
                </div>
            </div>

            <div class="avatar"><?= htmlspecialchars(mb_strtoupper(mb_substr($_SESSION['utilisateur_nom'], 0, 1))) ?></div>
            <span class="nom"><?= htmlspecialchars($_SESSION['utilisateur_nom']) ?></span>
            <a href="index.php?action=logout" class="btn-logout">Déconnexion</a>
        </div>
    <?php endif; ?>
</header>