<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/_auth.php';

$type    = isset($_GET['type']) ? trim($_GET['type']) : 'covers';
$allowed = ['logos', 'covers', 'route'];

if (!in_array($type, $allowed, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo inválido.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
    exit;
}

if (empty($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No se recibió ningún archivo.']);
    exit;
}

$file    = $_FILES['file'];
$maxSize = 5 * 1024 * 1024; // 5 MB

if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Error al subir el archivo (código: ' . $file['error'] . ').']);
    exit;
}

if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'El archivo supera el límite de 5 MB.']);
    exit;
}

/* Verificar MIME real (no solo extensión) */
$finfo         = new finfo(FILEINFO_MIME_TYPE);
$mime          = $finfo->file($file['tmp_name']);
$allowedMimes  = ['image/jpeg','image/jpg','image/png','image/webp','image/svg+xml','image/gif'];

if (!in_array($mime, $allowedMimes, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Tipo de archivo no permitido. Usá JPG, PNG, WebP o SVG.']);
    exit;
}

/* Determinar extensión segura */
$mimeToExt = [
    'image/jpeg'    => 'jpg',
    'image/jpg'     => 'jpg',
    'image/png'     => 'png',
    'image/webp'    => 'webp',
    'image/svg+xml' => 'svg',
    'image/gif'     => 'gif',
];
$ext = $mimeToExt[$mime] ?? 'jpg';

/* Crear directorio si no existe */
$uploadDir = dirname(dirname(__DIR__)) . '/uploads/' . $type . '/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

/* Nombre único */
$filename = bin2hex(random_bytes(12)) . '.' . $ext;
$dest     = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo guardar el archivo en el servidor.']);
    exit;
}

$url = 'uploads/' . $type . '/' . $filename;
echo json_encode(['success' => true, 'url' => $url]);
