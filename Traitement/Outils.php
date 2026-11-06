<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function repondreJson(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

function estConnecte(): bool
{
    return isset($_SESSION['utilisateur_id']);
}

function exigerConnexion(bool $ajax = false): void
{
    if (!estConnecte()) {
        if ($ajax) {
            repondreJson(['success' => false, 'message' => 'Connexion requise'], 401);
        }
        header('Location: index.php?action=login');
        exit;
    }
}

function nettoyer(string $texte): string
{
    return trim(strip_tags($texte));
}