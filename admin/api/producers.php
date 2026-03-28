<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/_auth.php';

$dataFile = dirname(dirname(__DIR__)) . '/data/producers.json';
$method   = $_SERVER['REQUEST_METHOD'];
$id       = isset($_GET['id']) ? trim($_GET['id']) : null;

/* ── Helpers ── */
function readProducers(string $file): array {
    if (!file_exists($file)) return [];
    return json_decode(file_get_contents($file), true) ?: [];
}

function writeProducers(string $file, array $data): bool {
    $tmp = $file . '.tmp';
    $ok  = file_put_contents($tmp,
        json_encode(array_values($data),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
    );
    return $ok !== false && rename($tmp, $file);
}

function sanitizeProducer(array $body, array $base = []): array {
    $contactoBase = $base['contacto'] ?? ['whatsapp'=>null,'instagram'=>null,'email'=>null,'web'=>null];
    $contactoIn   = $body['contacto'] ?? [];

    $coordenadas = null;
    if (!empty($body['coordenadas'])) {
        $lat = filter_var($body['coordenadas']['lat'] ?? null, FILTER_VALIDATE_FLOAT);
        $lng = filter_var($body['coordenadas']['lng'] ?? null, FILTER_VALIDATE_FLOAT);
        if ($lat !== false && $lng !== false) {
            $coordenadas = ['lat' => $lat, 'lng' => $lng];
        }
    }

    return [
        'id'          => $base['id'] ?? null,
        'orden'       => isset($body['orden']) ? (int)$body['orden'] : ($base['orden'] ?? 99),
        'nombre'      => trim($body['nombre'] ?? $base['nombre'] ?? ''),
        'galleta'     => $body['galleta']      ?? $base['galleta']     ?? null,
        'ubicacion'   => $body['ubicacion']    ?? $base['ubicacion']   ?? null,
        'coordenadas' => $coordenadas          ?? $base['coordenadas'] ?? null,
        'descripcion' => $body['descripcion']  ?? $base['descripcion'] ?? null,
        'historia'    => $body['historia']     ?? $base['historia']    ?? null,
        'ingredientes'=> array_values(array_filter(
                            array_map('trim', (array)($body['ingredientes'] ?? $base['ingredientes'] ?? []))
                         )),
        'color'       => $body['color']        ?? $base['color']       ?? '#1A2518',
        'colorOscuro' => $body['colorOscuro']  ?? $base['colorOscuro'] ?? '#0E1610',
        'logo'        => $body['logo']         ?? $base['logo']        ?? null,
        'imagen'      => $body['imagen']       ?? $base['imagen']      ?? null,
        'maps_url'    => $body['maps_url']     ?? $base['maps_url']    ?? null,
        'contacto'    => [
            'whatsapp'  => $contactoIn['whatsapp']  ?? $contactoBase['whatsapp'],
            'instagram' => $contactoIn['instagram'] ?? $contactoBase['instagram'],
            'email'     => $contactoIn['email']     ?? $contactoBase['email'],
            'web'       => $contactoIn['web']       ?? $contactoBase['web'],
        ],
    ];
}

/* ── GET ── */
if ($method === 'GET') {
    $all = readProducers($dataFile);
    usort($all, fn($a,$b) => ($a['orden'] ?? 99) <=> ($b['orden'] ?? 99));

    if ($id !== null) {
        $found = null;
        foreach ($all as $p) {
            if ((string)$p['id'] === $id) { $found = $p; break; }
        }
        if (!$found) { http_response_code(404); echo json_encode(['error'=>'No encontrado.']); exit; }
        echo json_encode(['success' => true, 'data' => $found]);
    } else {
        echo json_encode(['success' => true, 'data' => $all]);
    }
    exit;
}

/* ── POST: crear ── */
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    if (empty($body['nombre'])) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre es requerido.']);
        exit;
    }

    $all   = readProducers($dataFile);
    $maxId = 0;
    foreach ($all as $p) { $maxId = max($maxId, (int)$p['id']); }

    $new       = sanitizeProducer($body);
    $new['id'] = (string)($maxId + 1);
    if (!$new['orden'] || $new['orden'] === 99) {
        $new['orden'] = count($all) + 1;
    }

    $all[] = $new;
    if (!writeProducers($dataFile, $all)) {
        http_response_code(500); echo json_encode(['error'=>'Error al guardar.']); exit;
    }
    http_response_code(201);
    echo json_encode(['success' => true, 'data' => $new]);
    exit;
}

/* ── PUT: editar ── */
if ($method === 'PUT') {
    if (!$id) { http_response_code(400); echo json_encode(['error'=>'ID requerido.']); exit; }

    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $all  = readProducers($dataFile);

    $found = false;
    $updated = null;
    foreach ($all as &$p) {
        if ((string)$p['id'] === $id) {
            $p       = sanitizeProducer($body, $p);
            $p['id'] = $id;
            $updated = $p;
            $found   = true;
            break;
        }
    }
    unset($p);

    if (!$found) { http_response_code(404); echo json_encode(['error'=>'No encontrado.']); exit; }
    if (!writeProducers($dataFile, $all)) {
        http_response_code(500); echo json_encode(['error'=>'Error al guardar.']); exit;
    }
    echo json_encode(['success' => true, 'data' => $updated]);
    exit;
}

/* ── DELETE ── */
if ($method === 'DELETE') {
    if (!$id) { http_response_code(400); echo json_encode(['error'=>'ID requerido.']); exit; }

    $all      = readProducers($dataFile);
    $filtered = array_filter($all, fn($p) => (string)$p['id'] !== $id);

    if (count($filtered) === count($all)) {
        http_response_code(404); echo json_encode(['error'=>'No encontrado.']); exit;
    }
    if (!writeProducers($dataFile, array_values($filtered))) {
        http_response_code(500); echo json_encode(['error'=>'Error al guardar.']); exit;
    }
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
