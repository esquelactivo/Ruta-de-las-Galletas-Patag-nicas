/* ============================================================
   RUTA DE LAS GALLETAS PATAGÓNICAS — App Logic & Data
   ============================================================
   Para editar productores, modificá el array PRODUCTORES.
   Campos disponibles por productor:
     - nombre:      (string)  Nombre del productor — REQUERIDO
     - galleta:     (string)  Nombre de la galleta — null = "Por definir"
     - ubicacion:   (string)  Ciudad / localidad    — null = "Por definir"
     - descripcion: (string)  Descripción corta     — null = oculto
     - tags:        (array)   Etiquetas extra        — [] = ninguna
   ============================================================ */

const PRODUCTORES = [
  {
    nombre:      "Reina Mora",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Pueblo Carao",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Croeso",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Haiku",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Tyte",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Tierra Caracol",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Tierra de Brotes",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Nain Maggie",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Las Mutisias",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Valle Andino",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Peonias",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "La Floral",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Viñas del Nant y Fall",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  },
  {
    nombre:      "Caricias del Bosque",
    galleta:     null,
    ubicacion:   null,
    descripcion: null,
    tags:        []
  }
];

/* ===== RENDER PRODUCER CARDS ===== */
function renderProductores() {
  const grid = document.getElementById('productores-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTORES.map((p, i) => {
    const num     = i + 1;
    const padded  = String(num).padStart(2, '0');
    const delay   = (i * 0.045).toFixed(2);

    const galletaHTML = p.galleta
      ? `<span class="card__field-val">${escHTML(p.galleta)}</span>`
      : `<span class="card__field-val--empty">Por definir</span>`;

    const ubicacionHTML = p.ubicacion
      ? `<span class="card__field-val">${escHTML(p.ubicacion)}</span>`
      : `<span class="card__field-val--empty">Por definir</span>`;

    const descHTML = p.descripcion
      ? `<p class="card__desc">${escHTML(p.descripcion)}</p>`
      : '';

    return `
      <article class="card" role="listitem" data-num="${padded}" style="animation-delay:${delay}s">
        <p class="card__stop">Parada ${padded}</p>
        <h3 class="card__name">${escHTML(p.nombre)}</h3>
        <div class="card__fields">
          <div class="card__field">
            <span class="card__field-key">Galleta</span>
            ${galletaHTML}
          </div>
          <div class="card__field">
            <span class="card__field-key">Ubicación</span>
            ${ubicacionHTML}
          </div>
        </div>
        ${descHTML}
      </article>`;
  }).join('');
}

/* ===== RENDER ROUTE DOTS (about section) ===== */
function renderRouteDots() {
  const container = document.getElementById('route-visual');
  if (!container) return;

  container.innerHTML = PRODUCTORES.map((p, i) => {
    const isLast = i === PRODUCTORES.length - 1;
    return `
      <div class="route-dot">
        <div class="route-dot__marker"></div>
        ${!isLast ? '<div class="route-dot__line"></div>' : ''}
        <span class="route-dot__name">${escHTML(p.nombre)}</span>
      </div>`;
  }).join('');
}

/* ===== UTILS ===== */
function escHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ===== PWA — INSTALL PROMPT ===== */
let deferredPrompt = null;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.hidden = false;
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.hidden = true;
  deferredPrompt = null;
});

/* ===== SERVICE WORKER REGISTRATION ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .catch((err) => console.warn('[RGP] SW registration failed:', err));
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderProductores();
  renderRouteDots();
});
