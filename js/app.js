/* ============================================================
   RUTA DE LAS GALLETAS PATAGÓNICAS — App Logic & Data
   ============================================================
   Para editar productores, modificá el array PRODUCTORES.
   Campos por productor:
     nombre:      (string)  REQUERIDO
     galleta:     (string)  null → "Por definir"
     ubicacion:   (string)  null → "Por definir"
     descripcion: (string)  null → oculto
   ============================================================ */

const PRODUCTORES = [
  { nombre: "Reina Mora",           galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Pueblo Carao",         galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Croeso",               galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Haiku",                galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Tyte",                 galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Tierra Caracol",       galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Tierra de Brotes",     galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Nain Maggie",          galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Las Mutisias",         galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Valle Andino",         galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Peonias",              galleta: null, ubicacion: null, descripcion: null },
  { nombre: "La Floral",            galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Viñas del Nant y Fall",galleta: null, ubicacion: null, descripcion: null },
  { nombre: "Caricias del Bosque",  galleta: null, ubicacion: null, descripcion: null }
];

/* ===== RENDER PRODUCER LIST ===== */
function renderProductores() {
  const list = document.getElementById('producer-list');
  if (!list) return;

  list.innerHTML = PRODUCTORES.map((p, i) => {
    const num = String(i + 1).padStart(2, '0');

    const galletaHTML = p.galleta
      ? `<span class="field__val">${esc(p.galleta)}</span>`
      : `<span class="field__val field__val--empty">Por definir</span>`;

    const ubicacionHTML = p.ubicacion
      ? `<span class="field__val">${esc(p.ubicacion)}</span>`
      : `<span class="field__val field__val--empty">Por definir</span>`;

    const descHTML = p.descripcion
      ? `<p class="field__desc">${esc(p.descripcion)}</p>`
      : '';

    return `
      <li class="producer-item" role="listitem" data-index="${i}">
        <button class="producer-row" aria-expanded="false" aria-controls="detail-${i}">
          <span class="producer-row__num">${num}</span>
          <span class="producer-row__name">${esc(p.nombre)}</span>
          <svg class="producer-row__chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="producer-detail" id="detail-${i}" role="region" aria-label="${esc(p.nombre)}">
          <div class="producer-detail__inner">
            <div class="field">
              <span class="field__key">Galleta</span>
              ${galletaHTML}
            </div>
            <div class="field">
              <span class="field__key">Ubicación</span>
              ${ubicacionHTML}
            </div>
            ${descHTML}
          </div>
        </div>
      </li>`;
  }).join('');

  /* Accordion toggle */
  list.querySelectorAll('.producer-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.producer-item');
      const isOpen = item.classList.contains('open');

      /* Cerrar todos */
      list.querySelectorAll('.producer-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.producer-row').setAttribute('aria-expanded', 'false');
      });

      /* Abrir el clickeado si estaba cerrado */
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        /* Scroll suave para que el item quede visible */
        setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
      }
    });
  });
}

/* ===== SCREEN NAVIGATION ===== */
function initNav() {
  const navBtns = document.querySelectorAll('.nav-item[data-screen]');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = 'screen-' + btn.dataset.screen;

      /* Screens */
      document.querySelectorAll('.screen').forEach(s => {
        const isTarget = s.id === targetId;
        s.classList.toggle('active', isTarget);
        s.hidden = !isTarget;
      });

      /* Nav items */
      navBtns.forEach(b => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-current', isActive ? 'page' : 'false');
      });
    });
  });
}

/* ===== PWA INSTALL ===== */
function initInstall() {
  let prompt = null;
  const btn  = document.getElementById('install-btn');

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    prompt = e;
    if (btn) btn.hidden = false;
  });

  if (btn) {
    btn.addEventListener('click', async () => {
      if (!prompt) return;
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      prompt = null;
      btn.hidden = true;
    });
  }

  window.addEventListener('appinstalled', () => {
    if (btn) btn.hidden = true;
    prompt = null;
  });
}

/* ===== SERVICE WORKER ===== */
function initSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .catch(err => console.warn('[RGP] SW:', err));
    });
  }
}

/* ===== UTILS ===== */
function esc(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderProductores();
  initNav();
  initInstall();
  initSW();
});
