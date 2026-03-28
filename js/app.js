/* ============================================================
   RUTA DE LAS GALLETAS PATAGÓNICAS — PWA v4
   Los datos se cargan desde data/config.json y data/producers.json.
   Para editar contenido, usá el panel de admin en /admin/
   ============================================================ */

/* ════════ ESTADO GLOBAL ════════ */
let PRODUCTORES = [];
let CONFIG      = {};

/* ════════ CARGA DE DATOS ════════ */
async function loadData() {
  try {
    const [cfgRes, prodRes] = await Promise.all([
      fetch('data/config.json'),
      fetch('data/producers.json'),
    ]);
    CONFIG      = cfgRes.ok  ? await cfgRes.json()  : {};
    PRODUCTORES = prodRes.ok ? await prodRes.json() : [];
    PRODUCTORES.sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
  } catch {
    /* Offline o error: seguimos con arrays vacíos */
    CONFIG      = {};
    PRODUCTORES = [];
  }
}

function applyConfig() {
  /* Colores */
  const root = document.documentElement;
  if (CONFIG.colorPrimario) root.style.setProperty('--primary', CONFIG.colorPrimario);
  if (CONFIG.colorAcento)   root.style.setProperty('--accent',  CONFIG.colorAcento);

  /* Nombre y subtítulo */
  const title = document.querySelector('.inicio__title');
  if (title && CONFIG.nombre) {
    const parts = CONFIG.nombre.split(' ');
    /* Intentar separar "Ruta de las / [Nombre] / [resto]" */
    title.innerHTML = CONFIG.nombre
      .replace(/galletas/i, '<em>Galletas</em>')
      .replace(/ruta de las/i, 'Ruta de las<br>');
  }

  /* Badge */
  const chip = document.querySelector('.chip');
  if (chip && CONFIG.subtitulo) chip.textContent = CONFIG.subtitulo;

  /* Stats */
  if (CONFIG.stats?.length) {
    const statsEl = document.querySelector('.inicio__stats');
    if (statsEl) {
      statsEl.innerHTML = CONFIG.stats.map((s, i) => `
        ${i > 0 ? '<span class="istat__sep" aria-hidden="true"></span>' : ''}
        <div class="istat">
          <span class="istat__n">${esc(s.numero)}</span>
          <span class="istat__l">${esc(s.label)}</span>
        </div>`).join('');
    }
  }

  /* Título de la pestaña */
  if (CONFIG.nombre) document.title = CONFIG.nombre;
}

/* ════════ RENDER CARDS ════════ */
function renderCards() {
  const grid = document.getElementById('cards-grid');
  if (!grid) return;

  if (!PRODUCTORES.length) {
    grid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-light);grid-column:1/-1">No hay productores cargados aún.</div>`;
    return;
  }

  grid.innerHTML = PRODUCTORES.map((p, i) => {
    const num    = String(i + 1).padStart(2, '0');
    const delay  = (i * 0.04).toFixed(2);
    const letter = p.nombre.charAt(0).toUpperCase();

    const imgStyle = p.imagen
      ? `background-image:url('${p.imagen}');background-size:cover;background-position:center;`
      : `background:linear-gradient(145deg,${p.color || '#1A2518'},${p.colorOscuro || '#0E1610'});`;

    const locHTML = p.ubicacion
      ? `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1C3.57 1 2 2.57 2 4.5c0 2.625 3.5 7 3.5 7S9 7.125 9 4.5C9 2.57 7.43 1 5.5 1zm0 4.25a.75.75 0 110-1.5.75.75 0 010 1.5z" fill="currentColor"/></svg>${esc(p.ubicacion)}`
      : '&mdash;';

    return `
      <article class="card" role="listitem" style="animation-delay:${delay}s" data-index="${i}">
        <div class="card__img" style="${imgStyle}" data-num="${num}">
          <div class="card__img-overlay"></div>
          ${!p.imagen ? `<span style="position:absolute;bottom:10px;left:12px;font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:rgba(255,255,255,0.9)">${esc(letter)}</span>` : ''}
        </div>
        <div class="card__body">
          <p class="card__num">Parada ${num}</p>
          <h3 class="card__name">${esc(p.nombre)}</h3>
          <p class="card__loc">${locHTML}</p>
        </div>
      </article>`;
  }).join('');

  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => openDetail(parseInt(card.dataset.index, 10)));
  });
}

/* ════════ PRODUCER DETAIL ════════ */
let currentMap   = null;
let currentIndex = -1;

function openDetail(index) {
  const p       = PRODUCTORES[index];
  if (!p) return;
  const overlay = document.getElementById('detail-overlay');
  const num     = String(index + 1).padStart(2, '0');
  currentIndex  = index;

  /* Color theming */
  overlay.style.setProperty('--producer-color',      p.color       || '#1A2518');
  overlay.style.setProperty('--producer-color-dark', p.colorOscuro || '#0E1610');

  /* Header */
  document.getElementById('det-stop').textContent    = `Parada ${num}`;

  /* Hero */
  document.getElementById('det-hero-num').textContent  = `Parada ${num}`;
  document.getElementById('det-hero-name').textContent = p.nombre;
  document.getElementById('det-loc-text').textContent  = p.ubicacion || 'Ubicación por confirmar';

  /* Galleta */
  const galletaBody = document.getElementById('det-galleta-body');
  let galHtml = '';
  if (p.galleta)
    galHtml += `<p class="det-galleta-name">${esc(p.galleta)}</p>`;
  else
    galHtml += `<p class="det-placeholder">Nombre de la galleta por definir</p>`;

  if (p.ingredientes?.length) {
    galHtml += `<p class="det-ingredientes-label">Ingredientes</p><div class="det-ingredientes">`;
    galHtml += p.ingredientes.map(i => `<span class="det-ing-tag">${esc(i)}</span>`).join('');
    galHtml += '</div>';
  }
  galletaBody.innerHTML = galHtml;

  /* Historia */
  document.getElementById('det-historia-body').innerHTML = p.historia
    ? `<p class="det-text">${esc(p.historia)}</p>`
    : `<p class="det-placeholder">Historia del productor próximamente.</p>`;

  /* Dirección */
  document.getElementById('det-address').textContent = p.ubicacion || 'Dirección por confirmar';

  /* Botones de acción */
  renderDetailActions(p);

  /* Mostrar overlay */
  overlay.removeAttribute('hidden');
  requestAnimationFrame(() => overlay.classList.add('open'));

  history.pushState({ producerIndex: index }, '', `#productor-${index + 1}`);

  const scroll = document.getElementById('det-scroll');
  if (scroll) scroll.scrollTop = 0;

  setTimeout(() => initMap(p), 320);
}

function closeDetail() {
  const overlay = document.getElementById('detail-overlay');
  overlay.classList.remove('open');
  setTimeout(() => {
    overlay.setAttribute('hidden', '');
    if (currentMap) { currentMap.remove(); currentMap = null; }
  }, 350);
}

function renderDetailActions(p) {
  const btnContact = document.getElementById('det-btn-contact');
  const btnMap     = document.getElementById('det-btn-map');

  /* Contacto */
  if (p.contacto?.whatsapp) {
    btnContact.onclick = () => window.open(`https://wa.me/${p.contacto.whatsapp.replace(/\D/g,'')}`, '_blank');
  } else if (p.contacto?.instagram) {
    btnContact.onclick = () => window.open(`https://instagram.com/${p.contacto.instagram.replace('@','')}`, '_blank');
  } else if (p.contacto?.email) {
    btnContact.onclick = () => { window.location.href = `mailto:${p.contacto.email}`; };
  } else if (p.contacto?.web) {
    btnContact.onclick = () => window.open(p.contacto.web, '_blank');
  } else {
    btnContact.onclick = () => alert('Información de contacto próximamente.');
  }

  /* Cómo llegar */
  if (p.maps_url) {
    btnMap.onclick = () => window.open(p.maps_url, '_blank');
  } else if (p.coordenadas?.lat) {
    btnMap.onclick = () => window.open(`https://maps.google.com/?q=${p.coordenadas.lat},${p.coordenadas.lng}`, '_blank');
  } else {
    btnMap.onclick = () => {
      const s = document.getElementById('det-scroll');
      const m = document.getElementById('det-sec-map');
      if (s && m) s.scrollTo({ top: m.offsetTop - 60, behavior: 'smooth' });
    };
  }
}

function initMap(producer) {
  const container = document.getElementById('detail-map');
  if (!container) return;

  if (currentMap) { currentMap.remove(); currentMap = null; }

  if (!producer.coordenadas?.lat) {
    container.innerHTML = `
      <div class="det-map-empty">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 5C14.48 5 10 9.48 10 15c0 7.5 10 20 10 20s10-12.5 10-20c0-5.52-4.48-10-10-10zm0 13.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" fill="#A8A49E"/></svg>
        <p>Ubicación por confirmar</p>
      </div>`;
    return;
  }

  if (typeof L === 'undefined') {
    container.innerHTML = `<div class="det-map-empty"><p>Mapa no disponible sin conexión</p></div>`;
    return;
  }

  const { lat, lng } = producer.coordenadas;
  currentMap = L.map('detail-map', { zoomControl: true, scrollWheelZoom: false })
    .setView([lat, lng], 14);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(currentMap);

  const letter   = producer.nombre.charAt(0).toUpperCase();
  const logoHTML = producer.logo
    ? `<img src="${producer.logo}" alt="${esc(producer.nombre)}">`
    : letter;

  const icon = L.divIcon({
    html:        `<div class="lf-marker" style="--mc:${producer.color}">${logoHTML}</div>`,
    className:   '',
    iconSize:    [44, 44],
    iconAnchor:  [22, 22],
    popupAnchor: [0, -28]
  });

  L.marker([lat, lng], { icon })
    .addTo(currentMap)
    .bindPopup(`<strong>${esc(producer.nombre)}</strong>${producer.ubicacion ? '<br>' + esc(producer.ubicacion) : ''}`)
    .openPopup();

  setTimeout(() => currentMap?.invalidateSize(), 100);
}

/* ════════ NAVEGACIÓN ════════ */
function initNav() {
  const app = document.getElementById('app');

  document.querySelectorAll('[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
  });
}

function switchScreen(name) {
  const app = document.getElementById('app');
  if (app) app.dataset.screen = name;

  document.querySelectorAll('.screen').forEach(s => {
    s.classList.toggle('active', s.id === `screen-${name}`);
  });

  document.querySelectorAll('[data-screen]').forEach(b => {
    const active = b.dataset.screen === name;
    b.classList.toggle('active', active);
    if (b.hasAttribute('aria-current')) b.setAttribute('aria-current', active ? 'page' : 'false');
  });
}

/* ════════ BROWSER BACK ════════ */
window.addEventListener('popstate', () => {
  const overlay = document.getElementById('detail-overlay');
  if (overlay?.classList.contains('open')) closeDetail();
});

/* ════════ PWA INSTALL ════════ */
function initInstall() {
  let prompt = null;
  const btns = [
    document.getElementById('install-btn'),
    document.getElementById('sidebar-install-btn'),
  ].filter(Boolean);

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); prompt = e;
    btns.forEach(b => b.hidden = false);
  });
  btns.forEach(btn => btn.addEventListener('click', async () => {
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice;
    prompt = null; btns.forEach(b => b.hidden = true);
  }));
  window.addEventListener('appinstalled', () => {
    prompt = null; btns.forEach(b => b.hidden = true);
  });
}

/* ════════ SERVICE WORKER ════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .catch(err => console.warn('[RGP] SW:', err));
  });
}

/* ════════ UTILS ════════ */
function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ════════ INIT ════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  applyConfig();
  renderCards();
  initNav();
  initInstall();

  document.getElementById('det-back').addEventListener('click', () => history.back());
  document.querySelector('.inicio__cta')?.addEventListener('click', () => switchScreen('ruta'));
});
