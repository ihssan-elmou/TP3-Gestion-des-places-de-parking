<?php
require_once __DIR__ . '/Outils.php';
require_once __DIR__ . '/../BD/Utilisateur.php';

class AuthTraitement
{
    // Retourne null si tout va bien, sinon le message d'erreur
    public static function inscrire(array $post): ?string
    {
        $nom      = nettoyer($post['nom'] ?? '');
        $email    = strtolower(nettoyer($post['email'] ?? ''));
        $mdp      = $post['mot_de_passe'] ?? '';
        $confirme = $post['confirmation'] ?? '';

        if ($nom === '' || $email === '' || $mdp === '') {
            return 'Tous les champs sont obligatoires';
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return 'Email invalide';
        }
        if (strlen($mdp) < 6) {
            return 'Mot de passe : 6 caractères minimum';
        }
        if ($mdp !== $confirme) {
            return 'Les mots de passe ne correspondent pas';
        }
        if (Utilisateur::trouverParEmail($email)) {
            return 'Cet email est déjà utilisé';
        }

        Utilisateur::creer($nom, $email, password_hash($mdp, PASSWORD_DEFAULT));
        return null;
    }

    public static function connecter(array $post): ?string
    {
        $email = strtolower(nettoyer($post['email'] ?? ''));
        $mdp   = $post['mot_de_passe'] ?? '';

        if ($email === '' || $mdp === '') {
            return 'Email et mot de passe obligatoires';
        }

        $u = Utilisateur::trouverParEmail($email);
        if (!$u || !password_verify($mdp, $u['mot_de_passe'])) {
            return 'Email ou mot de passe incorrect';
        }

        session_regenerate_id(true);
        $_SESSION['utilisateur_id']  = (int) $u['id'];
        $_SESSION['utilisateur_nom'] = $u['nom'];
        return null;
    }

    public static function deconnecter(): void
    {
        $_SESSION = [];
        session_destroy();
    }
}