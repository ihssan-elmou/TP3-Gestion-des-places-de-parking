<?php $titre = 'Connexion'; ?>
<?php require __DIR__ . '/../layouts/header.php'; ?>
<?php require __DIR__ . '/../layouts/navbar.php'; ?>

<main class="auth-box">
    <h1>Connexion</h1>

    <?php if ($erreur): ?>
        <p class="message erreur"><?= htmlspecialchars($erreur) ?></p>
    <?php endif; ?>

    <?php if ($succes): ?>
        <p class="message succes"><?= htmlspecialchars($succes) ?></p>
    <?php endif; ?>

    <form method="post" action="index.php?action=login">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required
               value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">

        <label for="mot_de_passe">Mot de passe</label>
        <input type="password" id="mot_de_passe" name="mot_de_passe" required>

        <button type="submit">Se connecter</button>
    </form>

    <p class="lien">Pas de compte ? <a href="index.php?action=register">S'inscrire</a></p>
</main>

<?php require __DIR__ . '/../layouts/footer.php'; ?>