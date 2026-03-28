<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/_auth.php';

$configFile = dirname(dirname(__DIR__)) . '/data/config.json';
$method     = $_SERVER['REQUEST_METHOD'];

function readConfig(string $file): array {
    if (!file_exists($file)) {
        return [
            'nombre'       => 'Mi Ruta',
            'subtitulo'    => '',
            'descripcion'  => '',
            'logo'         => null,
            'colorPrimario'=> '#1A2518',
            'colorAcento'  => '#C08A3E',
            'stats'        => [],
        ];
    }
    return json_decode(file_get_contents($file), true) ?: [];
}

function writeConfig(string $file, array $data): bool {
    $tmp = $file . '.tmp';
    $ok  = file_put_contents($tmp,
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
    );
    return $ok !== false && rename($tmp, $file);
}

/* GET */
if ($method === 'GET') {
    echo json_encode(['success' => true, 'data' => readConfig($configFile)]);
    exit;
}

/* POST */
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$body) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos inválidos.']);
        exit;
    }

    $current = readConfig($configFile);

    $allowed = ['nombre','subtitulo','descripcion','logo','colorPrimario','colorAcento','stats'];
    foreach ($allowed as $key) {
        if (array_key_exists($key, $body)) {
            $current[$key] = $body[$key];
        }
    }

    if (!writeConfig($configFile, $current)) {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo guardar la configuración.']);
        exit;
    }

    echo json_encode(['success' => true, 'data' => $current]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
