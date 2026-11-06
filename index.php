<?php
require_once __DIR__ . '/Traitement/Outils.php';
require_once __DIR__ . '/Traitement/Auth.php';

$action = $_GET['action'] ?? (estConnecte() ? 'parking' : 'login');
$erreur = null;
$succes = null;

switch ($action) {

    case 'login':
        if (estConnecte()) {
            header('Location: index.php?action=parking');
            exit;
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $erreur = AuthTraitement::connecter($_POST);
            if ($erreur === null) {
                header('Location: index.php?action=parking');
                exit;
            }
        }
        if (isset($_GET['inscrit'])) {
            $succes = 'Compte créé, tu peux te connecter';
        }
        require __DIR__ . '/IHM/auth/login.php';
        break;

    case 'register':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $erreur = AuthTraitement::inscrire($_POST);
            if ($erreur === null) {
                header('Location: index.php?action=login&inscrit=1');
                exit;
            }
        }
        require __DIR__ . '/IHM/auth/register.php';
        break;

    case 'logout':
        AuthTraitement::deconnecter();
        header('Location: index.php?action=login');
        exit;

    case 'parking':
        exigerConnexion();
        require __DIR__ . '/IHM/parking/dashboard.php';
        break;

    default:
        http_response_code(404);
        echo 'Page introuvable';
}