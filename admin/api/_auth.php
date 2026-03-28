<?php
/**
 * Middleware de autenticación.
 * Incluir al inicio de cada endpoint que requiera sesión.
 */
if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict',
    ]);
}

if (
    empty($_SESSION['admin_user']) ||
    empty($_SESSION['admin_expires']) ||
    time() > $_SESSION['admin_expires']
) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(401);
    echo json_encode(['error' => 'Sesión expirada. Iniciá sesión nuevamente.']);
    exit;
}
