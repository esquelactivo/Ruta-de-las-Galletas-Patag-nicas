<?php
session_start(['cookie_httponly' => true, 'cookie_samesite' => 'Strict']);
if (empty($_SESSION['admin_user']) || time() > ($_SESSION['admin_expires'] ?? 0)) {
    header('Location: index.php');
    exit;
}
$adminName = htmlspecialchars($_SESSION['admin_name'] ?? $_SESSION['admin_user']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard — Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/admin.css">
</head>
<body class="dashboard-page">

<div class="dash-app" id="dash-app">

  <!-- ═══ SIDEBAR ═══ -->
  <aside class="dash-sidebar" id="dash-sidebar">
    <div class="ds-brand">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="9" fill="rgba(255,255,255,0.1)"/>
        <circle cx="18" cy="15" r="8" fill="#F5EDD8"/>
        <circle cx="15" cy="12.5" r="1.6" fill="#8B5E3C" opacity="0.65"/>
        <circle cx="21" cy="13.8" r="1.3" fill="#8B5E3C" opacity="0.55"/>
        <circle cx="17" cy="18" r="1.4" fill="#8B5E3C" opacity="0.65"/>
        <circle cx="21.5" cy="18.5" r="1.1" fill="#8B5E3C" opacity="0.5"/>
        <path d="M5 29 L10.5 22.5 L14.5 25.5 L18 23 L21.5 26 L26 22 L31 29Z" fill="#C08A3E" opacity="0.9"/>
      </svg>
      <div class="ds-brand__text">
        <span class="ds-brand__name" id="sidebar-route-name">Cargando…</span>
        <span class="ds-brand__sub">Panel Admin</span>
      </div>
    </div>

    <nav class="ds-nav" aria-label="Secciones del admin">
      <button class="ds-nav-item active" data-view="productores">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.4"/></svg>
        Productores
      </button>
      <button class="ds-nav-item" data-view="configuracion">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        Configuración
      </button>
    </nav>

    <div class="ds-footer">
      <a href="../" target="_blank" class="ds-footer-link">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 2H3a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V8M8 2h4m0 0v4m0-4L6 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Ver sitio
      </a>
      <div class="ds-footer-user">
        <span class="ds-footer-user__name"><?= $adminName ?></span>
        <a href="logout.php" class="ds-footer-user__logout">Salir</a>
      </div>
    </div>
  </aside>

  <!-- ═══ MAIN ═══ -->
  <main class="dash-main" id="dash-main">

    <!-- VISTA: PRODUCTORES -->
    <div class="dash-view active" id="view-productores">
      <div class="dash-topbar">
        <div>
          <h1 class="dash-title">Productores</h1>
          <p class="dash-subtitle" id="prod-count">Cargando…</p>
        </div>
        <button class="btn btn--primary" id="btn-add-producer">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2v11M2 7.5h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          Agregar productor
        </button>
      </div>
      <div class="prod-list" id="prod-list">
        <div class="loading-state">Cargando productores…</div>
      </div>
    </div>

    <!-- VISTA: CONFIGURACIÓN -->
    <div class="dash-view" id="view-configuracion">
      <div class="dash-topbar">
        <div>
          <h1 class="dash-title">Configuración</h1>
          <p class="dash-subtitle">Datos generales de la ruta</p>
        </div>
        <button class="btn btn--primary" id="btn-save-config">Guardar cambios</button>
      </div>
      <div class="config-form" id="config-form">
        <div class="loading-state">Cargando configuración…</div>
      </div>
    </div>

  </main>
</div>

<!-- ═══ MODAL: EDITOR DE PRODUCTOR ═══ -->
<div class="modal-overlay" id="modal-overlay" hidden aria-modal="true" role="dialog">
  <div class="modal" id="modal">
    <div class="modal-header" id="modal-header">
      <h2 class="modal-title" id="modal-title">Productor</h2>
      <button class="modal-close" id="modal-close" aria-label="Cerrar">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="modal-body" id="modal-body">
      <!-- Renderizado por JS -->
    </div>
    <div class="modal-footer">
      <button class="btn btn--ghost" id="modal-cancel">Cancelar</button>
      <button class="btn btn--primary" id="modal-save">Guardar</button>
    </div>
  </div>
</div>

<!-- ═══ TOAST ═══ -->
<div class="toast-wrap" id="toast-wrap" aria-live="polite"></div>

<script src="js/admin.js"></script>
</body>
</html>
