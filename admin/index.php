<?php
session_start(['cookie_httponly' => true, 'cookie_samesite' => 'Strict']);
if (!empty($_SESSION['admin_user']) && time() < ($_SESSION['admin_expires'] ?? 0)) {
    header('Location: dashboard.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin — Ruta de las Galletas Patagónicas</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/admin.css">
</head>
<body class="login-page">

<div class="login-wrap">
  <div class="login-card">

    <div class="login-brand">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="12" fill="#1A2518"/>
        <circle cx="22" cy="19" r="10" fill="#F5EDD8"/>
        <circle cx="18.5" cy="15.5" r="2" fill="#8B5E3C" opacity="0.65"/>
        <circle cx="25" cy="17" r="1.7" fill="#8B5E3C" opacity="0.55"/>
        <circle cx="21" cy="22" r="1.8" fill="#8B5E3C" opacity="0.65"/>
        <circle cx="26" cy="22.5" r="1.4" fill="#8B5E3C" opacity="0.5"/>
        <path d="M6 37 L13.5 28 L19 31.5 L22 29 L26 32 L31.5 27.5 L38 37Z" fill="#C08A3E" opacity="0.9"/>
      </svg>
      <div>
        <p class="login-brand__name">Galletas Patagónicas</p>
        <p class="login-brand__sub">Panel de administración</p>
      </div>
    </div>

    <form id="login-form" novalidate>
      <div id="login-error" class="alert alert--error" hidden></div>

      <div class="field-group">
        <label class="field-label" for="username">Usuario</label>
        <input class="field-input" id="username" name="username" type="text"
               autocomplete="username" autocapitalize="none" required>
      </div>

      <div class="field-group">
        <label class="field-label" for="password">Contraseña</label>
        <div class="field-input-wrap">
          <input class="field-input" id="password" name="password" type="password"
                 autocomplete="current-password" required>
          <button type="button" class="field-eye" id="toggle-pw" aria-label="Mostrar contraseña" tabindex="-1">
            <svg id="eye-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 9s2.8-5 8-5 8 5 8 5-2.8 5-8 5-8-5-8-5z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              <circle cx="9" cy="9" r="2.5" stroke="currentColor" stroke-width="1.4"/>
            </svg>
          </button>
        </div>
      </div>

      <button type="submit" class="btn btn--primary btn--full" id="login-btn">
        Ingresar
      </button>
    </form>

  </div>
</div>

<script>
const form    = document.getElementById('login-form');
const errBox  = document.getElementById('login-error');
const loginBtn= document.getElementById('login-btn');
const togglePw= document.getElementById('toggle-pw');
const pwInput = document.getElementById('password');

togglePw.addEventListener('click', () => {
  const show = pwInput.type === 'password';
  pwInput.type = show ? 'text' : 'password';
  togglePw.setAttribute('aria-label', show ? 'Ocultar contraseña' : 'Mostrar contraseña');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errBox.hidden = true;
  loginBtn.disabled = true;
  loginBtn.textContent = 'Ingresando…';

  const username = document.getElementById('username').value.trim();
  const password = pwInput.value;

  try {
    const res  = await fetch('api/auth.php', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (res.ok && data.success) {
      window.location.href = 'dashboard.php';
    } else {
      errBox.textContent = data.error || 'Error al iniciar sesión.';
      errBox.hidden = false;
    }
  } catch {
    errBox.textContent = 'No se pudo conectar con el servidor.';
    errBox.hidden = false;
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Ingresar';
  }
});
</script>
</body>
</html>
