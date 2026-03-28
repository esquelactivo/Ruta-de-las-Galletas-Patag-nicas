/* ============================================================
   ADMIN PANEL — Ruta de las Galletas Patagónicas
   ============================================================ */

/* ════════ STATE ════════ */
const S = {
  producers: [],
  config:    {},
  editingId: null,   // null = nuevo productor
  saving:    false,
};

/* ════════ API ════════ */
const API = {
  async req(url, opts = {}) {
    const res  = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
    return data;
  },

  producers: {
    list:   ()        => API.req('api/producers.php'),
    create: (d)       => API.req('api/producers.php', { method: 'POST',   body: JSON.stringify(d) }),
    update: (id, d)   => API.req(`api/producers.php?id=${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    remove: (id)      => API.req(`api/producers.php?id=${id}`, { method: 'DELETE' }),
  },

  config: {
    get:    ()  => API.req('api/config.php'),
    save:   (d) => API.req('api/config.php', { method: 'POST', body: JSON.stringify(d) }),
  },

  upload: async (file, type = 'covers') => {
    const form = new FormData();
    form.append('file', file);
    const res  = await fetch(`api/upload.php?type=${type}`, { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al subir');
    return data;
  },
};

/* ════════ TOAST ════════ */
function toast(msg, type = 'success') {
  const wrap = document.getElementById('toast-wrap');
  const el   = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

/* ════════ NAVIGATION ════════ */
function initNav() {
  document.querySelectorAll('.ds-nav-item[data-view]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
}

function switchView(name) {
  document.querySelectorAll('.ds-nav-item').forEach(b =>
    b.classList.toggle('active', b.dataset.view === name)
  );
  document.querySelectorAll('.dash-view').forEach(v =>
    v.classList.toggle('active', v.id === `view-${name}`)
  );
  if (name === 'configuracion' && !S.config.nombre) loadConfig();
}

/* ════════ PRODUCERS VIEW ════════ */
async function loadProducers() {
  try {
    const { data } = await API.producers.list();
    S.producers = data;
    renderProducers();
  } catch (err) {
    document.getElementById('prod-list').innerHTML =
      `<div class="loading-state">Error al cargar: ${esc(err.message)}</div>`;
  }
}

function renderProducers() {
  const list = document.getElementById('prod-list');
  const count = document.getElementById('prod-count');
  count.textContent = `${S.producers.length} productor${S.producers.length !== 1 ? 'es' : ''} en la ruta`;

  if (!S.producers.length) {
    list.innerHTML = `<div class="empty-state"><p>No hay productores. Agregá el primero.</p></div>`;
    return;
  }

  list.innerHTML = S.producers.map((p, i) => {
    const num   = String(i + 1).padStart(2, '0');
    const meta  = [p.galleta, p.ubicacion].filter(Boolean).join(' · ') || 'Sin información aún';
    const letter= p.nombre.charAt(0).toUpperCase();

    return `
      <div class="prod-card" data-id="${p.id}">
        <div class="prod-card__swatch" style="background:${esc(p.color || '#1A2518')}">${letter}</div>
        <div class="prod-card__info">
          <p class="prod-card__num">Parada ${num}</p>
          <p class="prod-card__name">${esc(p.nombre)}</p>
          <p class="prod-card__meta">${esc(meta)}</p>
        </div>
        <div class="prod-card__actions">
          <button class="btn-icon btn-edit" data-id="${p.id}" title="Editar">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M10.5 2.5l2 2-7 7H3.5v-2l7-7z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="btn-icon btn-icon--danger btn-delete" data-id="${p.id}" title="Eliminar">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 4h11M5 4V2.5h5V4M6 7v4M9 7v4M3 4l.9 8.5A1 1 0 005 13.5h5a1 1 0 001.1-.9L12 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>`;
  }).join('');

  list.querySelectorAll('.btn-edit').forEach(btn =>
    btn.addEventListener('click', () => openModal(btn.dataset.id))
  );
  list.querySelectorAll('.btn-delete').forEach(btn =>
    btn.addEventListener('click', () => confirmDelete(btn.dataset.id))
  );
}

async function confirmDelete(id) {
  const p = S.producers.find(p => p.id === id);
  if (!p) return;
  if (!confirm(`¿Eliminar a "${p.nombre}"? Esta acción no se puede deshacer.`)) return;

  try {
    await API.producers.remove(id);
    toast(`${p.nombre} eliminado.`);
    await loadProducers();
  } catch (err) {
    toast(err.message, 'error');
  }
}

/* ════════ MODAL ════════ */
function openModal(id = null) {
  S.editingId = id;
  const p = id ? S.producers.find(p => p.id === id) : null;

  document.getElementById('modal-title').textContent = p ? `Editar: ${p.nombre}` : 'Nuevo productor';
  renderModalBody(p);

  const overlay = document.getElementById('modal-overlay');
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.modal-body').scrollTop = 0;
}

function closeModal() {
  document.getElementById('modal-overlay').hidden = true;
  document.body.style.overflow = '';
  S.editingId = null;
}

function renderModalBody(p) {
  const v = (val) => val ?? '';

  document.getElementById('modal-body').innerHTML = `

    <!-- Sección: Info básica -->
    <div class="acc-section">
      <div class="acc-header open" data-acc="info">
        <span class="acc-header__title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M7 6.5v4M7 4v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          Información básica
        </span>
        <svg class="acc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="acc-body" style="display:block">
        <div class="form-grid" style="margin-top:4px">
          <div class="field-group" style="grid-column:1/-1">
            <label class="field-label">Nombre del productor *</label>
            <input class="field-input" id="f-nombre" type="text" value="${esc(v(p?.nombre))}" required placeholder="Ej: Reina Mora">
          </div>
          <div class="field-group">
            <label class="field-label">Nombre de la galleta</label>
            <input class="field-input" id="f-galleta" type="text" value="${esc(v(p?.galleta))}" placeholder="Ej: Galleta de rosa mosqueta">
          </div>
          <div class="field-group">
            <label class="field-label">Descripción corta (para la tarjeta)</label>
            <input class="field-input" id="f-descripcion" type="text" value="${esc(v(p?.descripcion))}" placeholder="Máx. 80 caracteres">
          </div>
          <div class="field-group">
            <label class="field-label">Color primario del logo</label>
            <div class="color-field">
              <input type="color" id="f-color" value="${esc(v(p?.color) || '#1A2518')}">
              <input class="field-input color-hex" id="f-color-hex" type="text" value="${esc(v(p?.color) || '#1A2518')}" placeholder="#1A2518" maxlength="7">
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Color oscuro del logo</label>
            <div class="color-field">
              <input type="color" id="f-color-dark" value="${esc(v(p?.colorOscuro) || '#0E1610')}">
              <input class="field-input color-hex" id="f-color-dark-hex" type="text" value="${esc(v(p?.colorOscuro) || '#0E1610')}" placeholder="#0E1610" maxlength="7">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección: Historia -->
    <div class="acc-section">
      <div class="acc-header" data-acc="historia">
        <span class="acc-header__title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h10v10H2z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M4 5h6M4 7h6M4 9h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          Historia del productor
        </span>
        <svg class="acc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="acc-body">
        <div class="field-group" style="margin-top:4px">
          <label class="field-label">Historia / Sobre el productor</label>
          <textarea class="field-input" id="f-historia" rows="5" placeholder="Contá la historia del productor, su tradición, su relación con la Patagonia…">${esc(v(p?.historia))}</textarea>
        </div>
        <div class="field-group">
          <label class="field-label">Ingredientes de la galleta</label>
          <div class="ingredients-list" id="ing-list"></div>
          <div class="ingredients-add">
            <input class="field-input" id="ing-input" type="text" placeholder="Ej: Harina integral, Rosa mosqueta…">
            <button type="button" class="btn btn--ghost btn--sm" id="ing-add">Agregar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección: Ubicación -->
    <div class="acc-section">
      <div class="acc-header" data-acc="ubicacion">
        <span class="acc-header__title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4.79 1 3 2.79 3 5c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
          Ubicación
        </span>
        <svg class="acc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="acc-body">
        <div class="form-grid" style="margin-top:4px">
          <div class="field-group" style="grid-column:1/-1">
            <label class="field-label">Dirección / Localidad</label>
            <input class="field-input" id="f-ubicacion" type="text" value="${esc(v(p?.ubicacion))}" placeholder="Ej: Bariloche, Río Negro">
          </div>
          <div class="field-group">
            <label class="field-label">Latitud</label>
            <input class="field-input" id="f-lat" type="number" step="any" value="${esc(v(p?.coordenadas?.lat))}" placeholder="-41.1335">
          </div>
          <div class="field-group">
            <label class="field-label">Longitud</label>
            <input class="field-input" id="f-lng" type="number" step="any" value="${esc(v(p?.coordenadas?.lng))}" placeholder="-71.3103">
          </div>
          <div class="field-group" style="grid-column:1/-1">
            <label class="field-label">URL Google Maps</label>
            <input class="field-input" id="f-maps" type="url" value="${esc(v(p?.maps_url))}" placeholder="https://maps.app.goo.gl/...">
          </div>
        </div>
      </div>
    </div>

    <!-- Sección: Contacto -->
    <div class="acc-section">
      <div class="acc-header" data-acc="contacto">
        <span class="acc-header__title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 8.67c0 .2-.046.41-.14.61a2.38 2.38 0 01-.393.58c-.31.346-.654.52-1.014.52-.267 0-.554-.063-.854-.194a8.4 8.4 0 01-.854-.46 13.2 13.2 0 01-.827-.648 13 13 0 01-.64-.827 8.2 8.2 0 01-.453-.854C6.626 6.9 6.56 6.62 6.56 6.36c0-.267.06-.52.174-.75.114-.233.28-.447.52-.628.24-.174.5-.26.773-.26.107 0 .213.02.307.067.1.047.187.12.253.22l.874 1.234c.067.093.12.18.154.267.04.08.054.153.054.22 0 .086-.024.173-.067.253a1.1 1.1 0 01-.187.233l-.246.26a.167.167 0 00-.054.12c0 .027.007.047.02.067l.047.067c.067.133.193.3.36.5.18.2.367.406.567.6.2.2.4.387.607.56.2.173.367.286.5.346l.067.033a.22.22 0 00.1.02.174.174 0 00.127-.053l.246-.254a1.1 1.1 0 01.254-.187.514.514 0 01.207-.06c.066 0 .14.014.22.047.08.033.167.086.267.153l1.247.887c.1.067.167.153.207.247.033.093.047.186.047.28z" stroke="currentColor" stroke-width="1.1" stroke-miterlimit="10"/></svg>
          Contacto
        </span>
        <svg class="acc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="acc-body">
        <div class="form-grid" style="margin-top:4px">
          <div class="field-group">
            <label class="field-label">WhatsApp (con código de país)</label>
            <input class="field-input" id="f-whatsapp" type="tel" value="${esc(v(p?.contacto?.whatsapp))}" placeholder="+5492944000000">
          </div>
          <div class="field-group">
            <label class="field-label">Teléfono (para llamadas)</label>
            <input class="field-input" id="f-telefono" type="tel" value="${esc(v(p?.contacto?.telefono))}" placeholder="+5492944000000">
          </div>
          <div class="field-group">
            <label class="field-label">Instagram</label>
            <input class="field-input" id="f-instagram" type="text" value="${esc(v(p?.contacto?.instagram))}" placeholder="@nombre">
          </div>
          <div class="field-group">
            <label class="field-label">Email</label>
            <input class="field-input" id="f-email" type="email" value="${esc(v(p?.contacto?.email))}" placeholder="hola@ejemplo.com">
          </div>
          <div class="field-group">
            <label class="field-label">Sitio web</label>
            <input class="field-input" id="f-web" type="url" value="${esc(v(p?.contacto?.web))}" placeholder="https://...">
          </div>
        </div>
      </div>
    </div>

    <!-- Sección: Imágenes -->
    <div class="acc-section">
      <div class="acc-header" data-acc="imagenes">
        <span class="acc-header__title">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><circle cx="4.5" cy="5.5" r="1" stroke="currentColor" stroke-width="1.2"/><path d="M1 10l3.5-3.5 2 2 2.5-3 3 4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Imágenes
        </span>
        <svg class="acc-chevron" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="acc-body">
        <div class="form-grid" style="margin-top:4px">
          <div class="field-group">
            <label class="field-label">Logo del productor</label>
            ${uploadZoneHTML('f-logo', 'logos', p?.logo)}
          </div>
          <div class="field-group">
            <label class="field-label">Foto de portada</label>
            ${uploadZoneHTML('f-imagen', 'covers', p?.imagen)}
          </div>
        </div>
      </div>
    </div>`;

  /* Inicializar ingredientes */
  const ings = p?.ingredientes ?? [];
  renderIngredients(ings);

  /* Sync color pickers con hex inputs */
  syncColorPicker('f-color', 'f-color-hex');
  syncColorPicker('f-color-dark', 'f-color-dark-hex');

  /* Accordion */
  initAccordions();

  /* Image uploads */
  initUploadZone('f-logo',   'logos');
  initUploadZone('f-imagen', 'covers');

  /* Ingredient add button */
  document.getElementById('ing-add').addEventListener('click', () => {
    const input = document.getElementById('ing-input');
    const val   = input.value.trim();
    if (!val) return;
    const existing = getCurrentIngredients();
    if (!existing.includes(val)) renderIngredients([...existing, val]);
    input.value = '';
    input.focus();
  });
  document.getElementById('ing-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); document.getElementById('ing-add').click(); }
  });
}

function uploadZoneHTML(id, type, currentUrl) {
  const preview = currentUrl
    ? `<div class="upload-preview" id="${id}-preview">
        <img src="../${esc(currentUrl)}" alt="">
        <span class="upload-preview__name">${esc(currentUrl.split('/').pop())}</span>
        <button type="button" class="upload-preview__rm" data-target="${id}" title="Quitar imagen">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3L3 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        </button>
       </div>`
    : '';

  return `
    <input type="hidden" id="${id}-url" value="${esc(currentUrl ?? '')}">
    <div class="upload-zone" id="${id}-zone">
      <svg class="upload-zone__icon" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 22V10M10 16l6-6 6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 26h20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
      <p class="upload-zone__text">Arrastrá o hacé clic para subir</p>
      <p class="upload-zone__sub">JPG, PNG, WebP o SVG · Máx. 5 MB</p>
      <input type="file" class="upload-zone__input" id="${id}-file" accept="image/*">
    </div>
    <div id="${id}-preview-wrap">${preview}</div>`;
}

function initUploadZone(id, type) {
  const zone    = document.getElementById(`${id}-zone`);
  const input   = document.getElementById(`${id}-file`);
  const urlInput= document.getElementById(`${id}-url`);
  const previewW= document.getElementById(`${id}-preview-wrap`);

  if (!zone || !input) return;

  const handleFile = async (file) => {
    if (!file) return;
    zone.style.opacity = '0.6';
    try {
      const { url } = await API.upload(file, type);
      urlInput.value = url;
      previewW.innerHTML = `
        <div class="upload-preview" id="${id}-preview">
          <img src="../${esc(url)}" alt="">
          <span class="upload-preview__name">${esc(url.split('/').pop())}</span>
          <button type="button" class="upload-preview__rm" data-target="${id}" title="Quitar">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3L3 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          </button>
        </div>`;
      previewW.querySelector('.upload-preview__rm')?.addEventListener('click', () => {
        urlInput.value = ''; previewW.innerHTML = '';
      });
      toast('Imagen subida correctamente.');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      zone.style.opacity = '';
    }
  };

  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => handleFile(input.files[0]));
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  previewW.querySelectorAll('.upload-preview__rm').forEach(btn =>
    btn.addEventListener('click', () => { urlInput.value = ''; previewW.innerHTML = ''; })
  );
}

function syncColorPicker(pickerId, hexId) {
  const picker = document.getElementById(pickerId);
  const hex    = document.getElementById(hexId);
  if (!picker || !hex) return;

  picker.addEventListener('input', () => { hex.value = picker.value; });
  hex.addEventListener('input', () => {
    const val = hex.value.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) picker.value = val;
  });
}

/* ── Accordion ── */
function initAccordions() {
  document.querySelectorAll('.acc-header').forEach(h => {
    h.addEventListener('click', () => {
      const body = h.nextElementSibling;
      const open = h.classList.toggle('open');
      body.style.display = open ? 'block' : 'none';
    });
  });
}

/* ── Ingredients ── */
let _ingredients = [];

function renderIngredients(list) {
  _ingredients = [...list];
  const el = document.getElementById('ing-list');
  if (!el) return;
  el.innerHTML = _ingredients.map((ing, i) => `
    <span class="ing-tag">
      ${esc(ing)}
      <button type="button" class="ing-tag__rm" data-idx="${i}" aria-label="Quitar">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2L2 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      </button>
    </span>`).join('');

  el.querySelectorAll('.ing-tag__rm').forEach(btn =>
    btn.addEventListener('click', () => {
      _ingredients.splice(parseInt(btn.dataset.idx, 10), 1);
      renderIngredients(_ingredients);
    })
  );
}

function getCurrentIngredients() { return [..._ingredients]; }

/* ── Save producer ── */
async function saveProducer() {
  if (S.saving) return;

  const nombre = document.getElementById('f-nombre')?.value.trim();
  if (!nombre) { toast('El nombre del productor es requerido.', 'error'); return; }

  const lat  = parseFloat(document.getElementById('f-lat')?.value);
  const lng  = parseFloat(document.getElementById('f-lng')?.value);

  const data = {
    nombre,
    galleta:     document.getElementById('f-galleta')?.value.trim()    || null,
    descripcion: document.getElementById('f-descripcion')?.value.trim()|| null,
    historia:    document.getElementById('f-historia')?.value.trim()   || null,
    color:       document.getElementById('f-color')?.value             || '#1A2518',
    colorOscuro: document.getElementById('f-color-dark')?.value        || '#0E1610',
    ubicacion:   document.getElementById('f-ubicacion')?.value.trim()  || null,
    coordenadas: (!isNaN(lat) && !isNaN(lng)) ? { lat, lng } : null,
    maps_url:    document.getElementById('f-maps')?.value.trim()       || null,
    contacto: {
      whatsapp:  document.getElementById('f-whatsapp')?.value.trim()   || null,
      telefono:  document.getElementById('f-telefono')?.value.trim()   || null,
      instagram: document.getElementById('f-instagram')?.value.trim()  || null,
      email:     document.getElementById('f-email')?.value.trim()      || null,
      web:       document.getElementById('f-web')?.value.trim()        || null,
    },
    ingredientes: getCurrentIngredients(),
    logo:        document.getElementById('f-logo-url')?.value          || null,
    imagen:      document.getElementById('f-imagen-url')?.value        || null,
  };

  S.saving = true;
  const saveBtn = document.getElementById('modal-save');
  saveBtn.disabled = true; saveBtn.textContent = 'Guardando…';

  try {
    if (S.editingId) {
      await API.producers.update(S.editingId, data);
      toast(`${nombre} actualizado correctamente.`);
    } else {
      await API.producers.create(data);
      toast(`${nombre} agregado a la ruta.`);
    }
    closeModal();
    await loadProducers();
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    S.saving = false;
    saveBtn.disabled = false; saveBtn.textContent = 'Guardar';
  }
}

/* ════════ CONFIG VIEW ════════ */
async function loadConfig() {
  try {
    const { data } = await API.config.get();
    S.config = data;
    renderConfigForm(data);
    document.getElementById('sidebar-route-name').textContent = data.nombre || 'Mi Ruta';
  } catch (err) {
    document.getElementById('config-form').innerHTML =
      `<div class="loading-state">Error al cargar: ${esc(err.message)}</div>`;
  }
}

function renderConfigForm(c) {
  document.getElementById('config-form').innerHTML = `

    <div class="config-section">
      <h3 class="config-section__title">Identidad de la ruta</h3>
      <div class="form-grid">
        <div class="field-group" style="grid-column:1/-1">
          <label class="field-label">Nombre de la ruta *</label>
          <input class="field-input" id="c-nombre" type="text" value="${esc(c.nombre ?? '')}" placeholder="Ej: Ruta de las Galletas Patagónicas">
        </div>
        <div class="field-group">
          <label class="field-label">Subtítulo</label>
          <input class="field-input" id="c-subtitulo" type="text" value="${esc(c.subtitulo ?? '')}" placeholder="Ej: Patagonia · Argentina">
        </div>
        <div class="field-group">
          <label class="field-label">Color primario</label>
          <div class="color-field">
            <input type="color" id="c-color" value="${esc(c.colorPrimario || '#1A2518')}">
            <input class="field-input color-hex" id="c-color-hex" type="text" value="${esc(c.colorPrimario || '#1A2518')}" maxlength="7">
          </div>
        </div>
        <div class="field-group">
          <label class="field-label">Color de acento</label>
          <div class="color-field">
            <input type="color" id="c-acento" value="${esc(c.colorAcento || '#C08A3E')}">
            <input class="field-input color-hex" id="c-acento-hex" type="text" value="${esc(c.colorAcento || '#C08A3E')}" maxlength="7">
          </div>
        </div>
        <div class="field-group" style="grid-column:1/-1">
          <label class="field-label">Descripción</label>
          <textarea class="field-input" id="c-descripcion" rows="4" placeholder="Breve descripción de la ruta para los visitantes…">${esc(c.descripcion ?? '')}</textarea>
        </div>
      </div>
    </div>

    <div class="config-section">
      <h3 class="config-section__title">Logo principal de la ruta</h3>
      ${uploadZoneHTML('c-logo', 'route', c.logo)}
    </div>

    <div class="config-section">
      <h3 class="config-section__title">Estadísticas en pantalla de inicio</h3>
      <div class="stats-list" id="stats-list"></div>
    </div>`;

  renderStatsEditor(c.stats ?? []);
  syncColorPicker('c-color',  'c-color-hex');
  syncColorPicker('c-acento', 'c-acento-hex');
  initUploadZone('c-logo', 'route');
}

function renderStatsEditor(stats) {
  const list = document.getElementById('stats-list');
  if (!list) return;
  list.innerHTML = stats.map((s, i) => `
    <div class="stat-row">
      <input class="field-input" data-stat="${i}" data-key="numero" type="text" value="${esc(s.numero)}" placeholder="14">
      <input class="field-input" data-stat="${i}" data-key="label" type="text" value="${esc(s.label)}" placeholder="Productores">
      <button type="button" class="btn-icon btn-icon--danger" data-rm="${i}" title="Quitar">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2L2 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
      </button>
    </div>`).join('');

  list.querySelectorAll('.btn-icon[data-rm]').forEach(btn =>
    btn.addEventListener('click', () => {
      stats.splice(parseInt(btn.dataset.rm, 10), 1);
      renderStatsEditor(stats);
    })
  );
}

function getStatsFromForm() {
  const rows = document.querySelectorAll('.stat-row');
  return Array.from(rows).map(row => ({
    numero: row.querySelector('[data-key="numero"]')?.value.trim() || '',
    label:  row.querySelector('[data-key="label"]')?.value.trim()  || '',
  })).filter(s => s.numero || s.label);
}

async function saveConfig() {
  const data = {
    nombre:       document.getElementById('c-nombre')?.value.trim()      || '',
    subtitulo:    document.getElementById('c-subtitulo')?.value.trim()    || '',
    descripcion:  document.getElementById('c-descripcion')?.value.trim()  || '',
    colorPrimario:document.getElementById('c-color')?.value               || '#1A2518',
    colorAcento:  document.getElementById('c-acento')?.value              || '#C08A3E',
    logo:         document.getElementById('c-logo-url')?.value            || null,
    stats:        getStatsFromForm(),
  };

  const btn = document.getElementById('btn-save-config');
  btn.disabled = true; btn.textContent = 'Guardando…';

  try {
    await API.config.save(data);
    S.config = data;
    document.getElementById('sidebar-route-name').textContent = data.nombre || 'Mi Ruta';
    toast('Configuración guardada.');
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    btn.disabled = false; btn.textContent = 'Guardar cambios';
  }
}

/* ════════ UTILS ════════ */
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ════════ INIT ════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Nav */
  initNav();

  /* Load initial data */
  loadProducers();
  loadConfig();

  /* Add producer button */
  document.getElementById('btn-add-producer').addEventListener('click', () => openModal(null));

  /* Modal controls */
  document.getElementById('modal-close').addEventListener('click',  closeModal);
  document.getElementById('modal-cancel').addEventListener('click', closeModal);
  document.getElementById('modal-save').addEventListener('click',   saveProducer);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  /* Save config */
  document.getElementById('btn-save-config').addEventListener('click', saveConfig);

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('modal-overlay').hidden) closeModal();
  });
});
