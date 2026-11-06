<?php $titre = 'Inscription'; ?>
<?php require __DIR__ . '/../layouts/header.php'; ?>
<?php require __DIR__ . '/../layouts/navbar.php'; ?>

<main class="auth-box">
    <h1>Inscription</h1>

    <?php if ($erreur): ?>
        <p class="message erreur"><?= htmlspecialchars($erreur) ?></p>
    <?php endif; ?>

    <form method="post" action="index.php?action=register">
        <label for="nom">Nom</label>
        <input type="text" id="nom" name="nom" required
               value="<?= htmlspecialchars($_POST['nom'] ?? '') ?>">

        <label for="email">Email</label>
        <input type="email" id="email" name="email" required
               value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">

        <label for="mot_de_passe">Mot de passe</label>
        <input type="password" id="mot_de_passe" name="mot_de_passe" required>

        <label for="confirmation">Confirmer le mot de passe</label>
        <input type="password" id="confirmation" name="confirmation" required>

        <button type="submit">Créer mon compte</button>
    </form>

    <p class="lien">Déjà un compte ? <a href="index.php?action=login">Se connecter</a></p>
</main>

<?php require __DIR__ . '/../layouts/footer.php'; ?>