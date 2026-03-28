/* ============================================================
   RUTA DE LAS GALLETAS PATAGÓNICAS — v3
   ============================================================
   CÓMO EDITAR UN PRODUCTOR:
   Cada objeto en PRODUCTORES tiene estos campos:

     nombre      → Nombre del productor (requerido)
     galleta     → Nombre de la galleta       | null = "Por definir"
     ubicacion   → Texto de ubicación         | null = "Por definir"
     coordenadas → { lat, lng }               | null = sin mapa
     descripcion → Texto corto (card)         | null = oculto
     historia    → Texto largo (detalle)      | null = "Por definir"
     ingredientes→ [ "item1", "item2", ... ]  | [] = oculto
     color       → Color primario del logo (hex)
     colorOscuro → Versión oscura del color
     logo        → "images/logos/nombre.png"  | null = inicial del nombre
     imagen      → "images/nombre.jpg"        | null = fondo con color
     contacto    → { whatsapp, instagram, email, web } | null cada uno
   ============================================================ */

const PRODUCTORES = [
  {
    nombre:       "Reina Mora",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#7B2D5E",
    colorOscuro:  "#4E1A3C",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Pueblo Carao",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#C05A20",
    colorOscuro:  "#8A3A10",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Croeso",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#2B5FA8",
    colorOscuro:  "#1A3D78",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Haiku",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#4A5568",
    colorOscuro:  "#2D3447",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Tyte",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#C0392B",
    colorOscuro:  "#8C1B11",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Tierra Caracol",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#7D6B47",
    colorOscuro:  "#5A4A28",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Tierra de Brotes",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#3D7A4A",
    colorOscuro:  "#225830",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Nain Maggie",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#B84D8A",
    colorOscuro:  "#8A2860",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Las Mutisias",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#CC4A28",
    colorOscuro:  "#A03010",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Valle Andino",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#3B6B9A",
    colorOscuro:  "#1F4769",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Peonias",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#C0527A",
    colorOscuro:  "#8C2E54",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "La Floral",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#5A7A3C",
    colorOscuro:  "#3A5820",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Viñas del Nant y Fall",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#5C2D7A",
    colorOscuro:  "#3C1852",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  },
  {
    nombre:       "Caricias del Bosque",
    galleta:      null,
    ubicacion:    null,
    coordenadas:  null,
    descripcion:  null,
    historia:     null,
    ingredientes: [],
    color:        "#2D5C3E",
    colorOscuro:  "#1A3C24",
    logo:         null,
    imagen:       null,
    contacto:     { whatsapp: null, instagram: null, email: null, web: null }
  }
];

/* ════════════════════════════════════
   RENDER CARDS
════════════════════════════════════ */
function renderCards() {
  const grid = document.getElementById('cards-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTORES.map((p, i) => {
    const num    = String(i + 1).padStart(2, '0');
    const delay  = (i * 0.04).toFixed(2);
    const letter = p.nombre.charAt(0).toUpperCase();

    /* Image area: real image or color gradient */
    const imgStyle = p.imagen
      ? `background-image: url('${p.imagen}'); background-size: cover; background-position: center;`
      : `background: linear-gradient(145deg, ${p.color} 0%, ${p.colorOscuro} 100%);`;

    const locHTML = p.ubicacion
      ? `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1C3.57 1 2 2.57 2 4.5c0 2.625 3.5 7 3.5 7S9 7.125 9 4.5C9 2.57 7.43 1 5.5 1zm0 4.25a.75.75 0 110-1.5.75.75 0 010 1.5z" fill="currentColor"/></svg>${esc(p.ubicacion)}`
      : '—';

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

  /* Click handler */
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.index, 10);
      openDetail(idx);
    });
  });
}

/* ════════════════════════════════════
   PRODUCER DETAIL
════════════════════════════════════ */
let currentMap   = null;
let currentIndex = -1;

function openDetail(index) {
  const p       = PRODUCTORES[index];
  const overlay = document.getElementById('detail-overlay');
  const num     = String(index + 1).padStart(2, '0');
  currentIndex  = index;

  /* Color theming */
  overlay.style.setProperty('--producer-color',      p.color);
  overlay.style.setProperty('--producer-color-dark', p.colorOscuro);

  /* Header */
  document.getElementById('det-stop').textContent = `Parada ${num}`;

  /* Hero */
  document.getElementById('det-hero-num').textContent  = `Parada ${num}`;
  document.getElementById('det-hero-name').textContent = p.nombre;
  document.getElementById('det-loc-text').textContent  = p.ubicacion || 'Ubicación por confirmar';

  /* Galleta section */
  const galletaBody = document.getElementById('det-galleta-body');
  if (p.galleta || p.ingredientes.length > 0) {
    let html = '';
    if (p.galleta)
      html += `<p class="det-galleta-name">${esc(p.galleta)}</p>`;
    else
      html += `<p class="det-placeholder">Nombre de la galleta por definir</p>`;

    if (p.ingredientes.length > 0) {
      html += `<p class="det-ingredientes-label">Ingredientes</p>`;
      html += `<div class="det-ingredientes">`;
      html += p.ingredientes.map(ing => `<span class="det-ing-tag">${esc(ing)}</span>`).join('');
      html += `</div>`;
    }
    galletaBody.innerHTML = html;
  } else {
    galletaBody.innerHTML = `<p class="det-placeholder">Información de la galleta próximamente.</p>`;
  }

  /* Historia section */
  const historiaBody = document.getElementById('det-historia-body');
  historiaBody.innerHTML = p.historia
    ? `<p class="det-text">${esc(p.historia)}</p>`
    : `<p class="det-placeholder">Historia del productor próximamente.</p>`;

  /* Address */
  document.getElementById('det-address').textContent =
    p.ubicacion ? p.ubicacion : 'Dirección por confirmar';

  /* Action buttons */
  renderDetailActions(p);

  /* Show overlay */
  overlay.removeAttribute('hidden');
  requestAnimationFrame(() => overlay.classList.add('open'));

  /* Push history state for browser back */
  history.pushState({ producerIndex: index }, '', `#productor-${index + 1}`);

  /* Reset scroll */
  const scroll = document.getElementById('det-scroll');
  if (scroll) scroll.scrollTop = 0;

  /* Init map after transition */
  setTimeout(() => initMap(p), 320);
}

function closeDetail() {
  const overlay = document.getElementById('detail-overlay');
  overlay.classList.remove('open');
  setTimeout(() => {
    overlay.setAttribute('hidden', '');
    /* Destroy map */
    if (currentMap) { currentMap.remove(); currentMap = null; }
  }, 350);
}

/* ── Action buttons ── */
function renderDetailActions(p) {
  const btnContact = document.getElementById('det-btn-contact');
  const btnMap     = document.getElementById('det-btn-map');

  /* Contact action: prioritize whatsapp > instagram > email > web */
  btnContact.onclick = null;
  if (p.contacto) {
    if (p.contacto.whatsapp) {
      btnContact.onclick = () => window.open(`https://wa.me/${p.contacto.whatsapp.replace(/\D/g,'')}`, '_blank');
    } else if (p.contacto.instagram) {
      btnContact.onclick = () => window.open(`https://instagram.com/${p.contacto.instagram.replace('@','')}`, '_blank');
    } else if (p.contacto.email) {
      btnContact.onclick = () => { window.location.href = `mailto:${p.contacto.email}`; };
    } else if (p.contacto.web) {
      btnContact.onclick = () => window.open(p.contacto.web, '_blank');
    } else {
      btnContact.onclick = () => alert('Información de contacto próximamente.');
    }
  }

  /* Map action: open Google Maps or scroll to map */
  if (p.coordenadas) {
    const { lat, lng } = p.coordenadas;
    btnMap.onclick = () => window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank');
  } else {
    btnMap.onclick = () => {
      const scroll = document.getElementById('det-scroll');
      const mapSec = document.getElementById('det-sec-map');
      if (scroll && mapSec) scroll.scrollTo({ top: mapSec.offsetTop - 60, behavior: 'smooth' });
    };
  }
}

/* ── Leaflet map ── */
function initMap(producer) {
  const container = document.getElementById('detail-map');
  if (!container) return;

  /* Destroy previous map */
  if (currentMap) { currentMap.remove(); currentMap = null; }

  /* No coordinates: show placeholder */
  if (!producer.coordenadas || !producer.coordenadas.lat) {
    container.innerHTML = `
      <div class="det-map-empty">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 5C14.48 5 10 9.48 10 15c0 7.5 10 20 10 20s10-12.5 10-20c0-5.52-4.48-10-10-10zm0 13.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" fill="#A8A49E"/></svg>
        <p>Ubicación por confirmar</p>
      </div>`;
    return;
  }

  /* Check if Leaflet is loaded */
  if (typeof L === 'undefined') {
    container.innerHTML = `<div class="det-map-empty"><p>Mapa no disponible sin conexión</p></div>`;
    return;
  }

  const { lat, lng } = producer.coordenadas;

  currentMap = L.map('detail-map', {
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true
  }).setView([lat, lng], 14);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(currentMap);

  /* Custom marker */
  const letter     = producer.nombre.charAt(0).toUpperCase();
  const logoHTML   = producer.logo
    ? `<img src="${producer.logo}" alt="${esc(producer.nombre)}">`
    : letter;
  const markerIcon = L.divIcon({
    html:        `<div class="lf-marker" style="--mc:${producer.color}">${logoHTML}</div>`,
    className:   '',
    iconSize:    [44, 44],
    iconAnchor:  [22, 22],
    popupAnchor: [0, -28]
  });

  L.marker([lat, lng], { icon: markerIcon })
    .addTo(currentMap)
    .bindPopup(`<strong>${esc(producer.nombre)}</strong>${producer.ubicacion ? '<br>' + esc(producer.ubicacion) : ''}`)
    .openPopup();

  /* Fix rendering after visibility */
  setTimeout(() => currentMap && currentMap.invalidateSize(), 100);
}

/* ════════════════════════════════════
   SCREEN NAVIGATION
════════════════════════════════════ */
function initNav() {
  const app = document.getElementById('app');

  /* Combine bottom nav + sidebar nav items */
  const allNavBtns = document.querySelectorAll('[data-screen]');

  allNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen;
      switchScreen(target);
    });
  });
}

function switchScreen(name) {
  const app = document.getElementById('app');
  app.dataset.screen = name;

  /* Screens */
  document.querySelectorAll('.screen').forEach(s => {
    const isTarget = s.id === `screen-${name}`;
    s.classList.toggle('active', isTarget);
  });

  /* Nav items — all buttons sharing [data-screen] */
  document.querySelectorAll('[data-screen]').forEach(b => {
    const isActive = b.dataset.screen === name;
    b.classList.toggle('active', isActive);
    if (b.hasAttribute('aria-current')) {
      b.setAttribute('aria-current', isActive ? 'page' : 'false');
    }
  });
}

/* ════════════════════════════════════
   BROWSER BACK BUTTON
════════════════════════════════════ */
window.addEventListener('popstate', (e) => {
  const overlay = document.getElementById('detail-overlay');
  if (!overlay.classList.contains('open')) return;
  closeDetail();
});

/* ════════════════════════════════════
   PWA INSTALL
════════════════════════════════════ */
function initInstall() {
  let prompt = null;

  /* Both install buttons (mobile info screen + desktop sidebar) */
  const btns = [
    document.getElementById('install-btn'),
    document.getElementById('sidebar-install-btn')
  ].filter(Boolean);

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    prompt = e;
    btns.forEach(b => b.hidden = false);
  });

  btns.forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!prompt) return;
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      prompt = null;
      btns.forEach(b => b.hidden = true);
    });
  });

  window.addEventListener('appinstalled', () => {
    prompt = null;
    btns.forEach(b => b.hidden = true);
  });
}

/* ════════════════════════════════════
   SERVICE WORKER
════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .catch(err => console.warn('[RGP] SW:', err));
  });
}

/* ════════════════════════════════════
   UTILS
════════════════════════════════════ */
function esc(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ════════════════════════════════════
   INIT
════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
  initNav();
  initInstall();

  /* Back button on detail overlay */
  document.getElementById('det-back').addEventListener('click', () => {
    history.back(); /* triggers popstate → closeDetail */
  });
});
