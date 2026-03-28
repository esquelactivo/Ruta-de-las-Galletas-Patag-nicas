<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict',
    ]);
}

$method      = $_SERVER['REQUEST_METHOD'];
$settingsFile = dirname(__DIR__) . '/config/settings.php';

if (!file_exists($settingsFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Configuración no encontrada.']);
    exit;
}

$settings = require $settingsFile;

/* ── GET: verificar sesión activa ── */
if ($method === 'GET') {
    $active = !empty($_SESSION['admin_user'])
           && !empty($_SESSION['admin_expires'])
           && time() < $_SESSION['admin_expires'];

    echo json_encode([
        'logged_in' => $active,
        'user'      => $active ? $_SESSION['admin_user'] : null,
        'name'      => $active ? $_SESSION['admin_name']  : null,
        'role'      => $active ? $_SESSION['admin_role']  : null,
    ]);
    exit;
}

/* ── POST: login ── */
if ($method === 'POST') {
    $body     = json_decode(file_get_contents('php://input'), true) ?? [];
    $username = trim($body['username'] ?? '');
    $password = $body['password'] ?? '';

    if ($username === '' || $password === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Usuario y contraseña son requeridos.']);
        exit;
    }

    $matched = null;
    foreach ($settings['users'] as $idx => $u) {
        if ($u['username'] !== $username) continue;

        $valid = false;
        if (!empty($u['hashed'])) {
            $valid = password_verify($password, $u['password']);
        } else {
            $valid = hash_equals($u['password'], $password);
        }

        if ($valid) {
            $matched = ['user' => $u, 'idx' => $idx];

            /* Auto-hash al primer login ── */
            if (empty($u['hashed'])) {
                $settings['users'][$idx]['password'] = password_hash($password, PASSWORD_DEFAULT);
                $settings['users'][$idx]['hashed']   = true;

                /* Reescribir settings.php con contraseña hasheada */
                $newContent = "<?php\nreturn " . var_export($settings, true) . ";\n";
                @file_put_contents($settingsFile, $newContent);
            }
        }
        break;
    }

    if ($matched === null) {
        /* Pequeño delay para dificultar fuerza bruta */
        usleep(500000);
        http_response_code(401);
        echo json_encode(['error' => 'Usuario o contraseña incorrectos.']);
        exit;
    }

    $u = $matched['user'];
    session_regenerate_id(true);
    $_SESSION['admin_user']    = $u['username'];
    $_SESSION['admin_name']    = $u['name'];
    $_SESSION['admin_role']    = $u['role'];
    $_SESSION['admin_expires'] = time() + ($settings['session_lifetime'] ?? 28800);

    echo json_encode([
        'success' => true,
        'name'    => $u['name'],
        'role'    => $u['role'],
    ]);
    exit;
}

/* ── DELETE: logout ── */
if ($method === 'DELETE') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
