// Tinta Vanilla JS App

const demoImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1200&auto=format&fit=crop"
];
let demoComments = [
  { id: 1, user: "Val", text: "¿Tienes disponibilidad el viernes?" },
  { id: 2, user: "Leo", text: "Me encanta este estilo 💜" },
  { id: 3, user: "Meli", text: "¿Cuánto dura la sesión completa?" },
  { id: 4, user: "Fran", text: "Te escribí por DM ✨" }
];
const reservasSeed = [
  { id: 1, style: 'Realismo', time: 'Vie 18:00 · Estudio Ñuñoa', lat: -33.456, lon: -70.595, label: 'Estudio Ñuñoa' },
  { id: 2, style: 'Neo-trad', time: 'Sáb 11:30 · Estudio Providencia', lat: -33.426, lon: -70.617, label: 'Estudio Providencia' },
  { id: 3, style: 'Minimalista', time: 'Dom 15:00 · Estudio Centro', lat: -33.45, lon: -70.65, label: 'Estudio Centro' }
];
let profile = { name: "Nombre Usuario", username: "usuario", bio: "Artista del tatuaje. Neo-trad, realismo y minimalista.", location: "Santiago" };
let posts = [
  { id: 1, img: demoImages[0], title: "Rosa Neo-trad", style: "Neo-trad", caption: "Sombras suaves", likes: 120, saved: true },
  { id: 2, img: demoImages[1], title: "Realismo lobo", style: "Realismo", caption: "Negro y gris", likes: 98, saved: false },
  { id: 3, img: demoImages[2], title: "Minimal flor", style: "Minimalista", caption: "Líneas finas", likes: 76, saved: false }
];
const tattooerFeed = [
  { id: 'f1', title: 'Flash rosa neo-trad', artist: 'Valeria Ink', style: 'Neo-trad', city: 'Santiago', country: 'Chile', distance: 3, availability: 'Próximos 7 días', img: demoImages[0] },
  { id: 'f2', title: 'Realismo lobo gris', artist: 'Diego Arte', style: 'Realismo', city: 'Providencia', country: 'Chile', distance: 6, availability: 'Agenda abierta', img: demoImages[1] },
  { id: 'f3', title: 'Minimalista luna', artist: 'Meli Studio', style: 'Minimalista', city: 'Ñuñoa', country: 'Chile', distance: 4, availability: 'Este mes', img: demoImages[2] },
  { id: 'f4', title: 'Blackwork botánico', artist: 'InkLab MX', style: 'Blackwork', city: 'CDMX', country: 'México', distance: 2, availability: 'Agenda abierta', img: demoImages[0] },
  { id: 'f5', title: 'Geométrico color', artist: 'Jalisco Ink', style: 'Neo-trad', city: 'Guadalajara', country: 'México', distance: 8, availability: 'Próximos 7 días', img: demoImages[1] },
  { id: 'f6', title: 'Linework fino', artist: 'Río Tattoo', style: 'Linework', city: 'Córdoba', country: 'Argentina', distance: 7, availability: 'Este mes', img: demoImages[2] },
  { id: 'f7', title: 'Tradicional ave', artist: 'Sol Studio', style: 'Tradicional', city: 'Valparaíso', country: 'Chile', distance: 10, availability: 'Agenda abierta', img: demoImages[0] },
  { id: 'f8', title: 'Botánico color', artist: 'Norte Ink', style: 'Realismo', city: 'CDMX', country: 'México', distance: 5, availability: 'Próximos 7 días', img: demoImages[1] },
  { id: 'f9', title: 'Fine line flor', artist: 'Estudio Ñuñoa', style: 'Linework', city: 'Ñuñoa', country: 'Chile', distance: 2, availability: 'Este mes', img: demoImages[2] },
  { id: 'f10', title: 'Minimal animal', artist: 'Cami Tattoo', style: 'Minimalista', city: 'CABA', country: 'Argentina', distance: 6, availability: 'Próximos 7 días', img: demoImages[0] },
  { id: 'f11', title: 'Neo-trad koi', artist: 'Estudio Centro', style: 'Neo-trad', city: 'Concepción', country: 'Chile', distance: 9, availability: 'Agenda abierta', img: demoImages[1] },
  { id: 'f12', title: 'Realismo retrato', artist: 'Val Ink', style: 'Realismo', city: 'Santiago', country: 'Chile', distance: 1, availability: 'Próximos 7 días', img: demoImages[2] }
];
const searchCatalog = [
  { id: 'r1', title: 'Flash neo-trad zorro', artist: 'Valeria Ink', type: 'Tatuajes', style: 'Neo-trad', country: 'Chile', region: 'Región Metropolitana', city: 'Santiago', distance: 4, availability: 'Próximos 7 días', date: '2024-11-04', remote: false, verified: true },
  { id: 'r2', title: 'Estudio Providencia', artist: 'Estudio Norte', type: 'Artistas', style: 'Realismo', country: 'Chile', region: 'Región Metropolitana', city: 'Providencia', distance: 7, availability: 'Agenda abierta', date: '2024-11-15', remote: true, verified: true },
  { id: 'r3', title: 'Ideas minimalistas', artist: 'Colección curada', type: 'Ideas', style: 'Minimalista', country: 'Chile', region: 'Región Metropolitana', city: 'Ñuñoa', distance: 3, availability: 'Este mes', date: '2024-11-20', remote: true, verified: false },
  { id: 'r4', title: 'Blackwork fineline', artist: 'InkLab MX', type: 'Tatuajes', style: 'Blackwork', country: 'México', region: 'Ciudad de México', city: 'CDMX', distance: 2, availability: 'Agenda abierta', date: '2024-11-08', remote: false, verified: true },
  { id: 'r5', title: 'Agenda estudio GDL', artist: 'Jalisco Ink', type: 'Artistas', style: 'Realismo', country: 'México', region: 'Jalisco', city: 'Guadalajara', distance: 9, availability: 'Próximos 7 días', date: '2024-11-02', remote: false, verified: false },
  { id: 'r6', title: 'Inspiración floral', artist: 'Board Argentina', type: 'Ideas', style: 'Neo-trad', country: 'Argentina', region: 'Buenos Aires', city: 'CABA', distance: 6, availability: 'Este mes', date: '2024-11-12', remote: true, verified: true }
];
const geoCatalog = {
  'Chile': {
    'Región Metropolitana': ['Santiago', 'Providencia', 'Ñuñoa'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Concón'],
    'Biobío': ['Concepción', 'Talcahuano', 'Chillán']
  },
  'México': {
    'Ciudad de México': ['CDMX', 'Coyoacán', 'Polanco'],
    'Jalisco': ['Guadalajara', 'Zapopan', 'Tlaquepaque'],
    'Nuevo León': ['Monterrey', 'San Pedro', 'Apodaca']
  },
  'Argentina': {
    'Buenos Aires': ['CABA', 'La Plata', 'San Isidro'],
    'Córdoba': ['Córdoba', 'Villa María', 'Río Cuarto'],
    'Santa Fe': ['Rosario', 'Santa Fe', 'Rafaela']
  }
};
const settings = {
  profile: {
    name: 'Nombre Usuario',
    email: 'usuario@correo.com',
    language: 'es-CL',
    timezone: 'GMT-3',
    notifications: true,
    digest: true
  },
  discovery: {
    country: 'Chile',
    region: 'Región Metropolitana',
    city: 'Santiago',
    radius: 25,
    style: 'Todos',
    nearby: true,
    newTalent: true,
    safe: false
  },
  account: {
    role: 'Tatuador',
    entryProfile: 'Tatuador',
    bookings: true,
    showPortfolio: true,
    messagesOpen: true
  }
};

const defaultFilters = () => ({
  country: settings.discovery.country,
  region: settings.discovery.region,
  city: settings.discovery.city,
  radius: settings.discovery.radius,
  type: 'Tatuajes',
  style: 'Todos',
  availability: 'Próximos 7 días',
  from: '',
  to: '',
  remote: false,
  verified: false
});

let searchFilters = defaultFilters();
let feedLoaded = 0;
const FEED_BATCH = 4;
let feedObserver;

let idx = 0;
let liked = false;
let saved = false;
let rightOpen = true;
let currentTab = 'inicio';

let dm = [
  { id: 1, user: "Val", preview: "¿Agenda el viernes?", time: "12:40", thread: [{ from: "Val", text: "Hola, ¿puedes el viernes?" }] },
  { id: 2, user: "Leo", preview: "Me gustó tu última pieza", time: "Ayer", thread: [{ from: "Leo", text: "Me gustó tu última pieza" }] },
  { id: 3, user: "Meli", preview: "¿Cuánto dura la sesión?", time: "Lun", thread: [{ from: "Meli", text: "¿Cuánto dura la sesión completa?" }] }
];
let activeDm = 1;

function miniMapUrl(lat, lon){
  const d = 0.01; const left = lon-d, right = lon+d, bottom = lat-d, top = lat+d;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${lat},${lon}`;
}

function setIconFilled(btn, on){
  btn.classList.toggle('icon-active', !!on);
  btn.classList.toggle('icon-fill', !!on);
}

function syncProfileWithSettings(){
  profile.name = settings.profile.name;
  profile.location = `${settings.discovery.city}, ${settings.discovery.region}`;
}

function populateSelect(select, values){
  if(!select) return;
  select.innerHTML = '';
  values.forEach(v=>{
    const opt = document.createElement('option');
    opt.value = v; opt.textContent = v; select.appendChild(opt);
  });
}

function applyRoleUI(){
  const badge = document.getElementById('roleBadge');
  if(badge) badge.textContent = settings.account.role === 'Tatuador' ? 'Tatuador' : 'Usuario';
  const capability = document.getElementById('roleCapability');
  if(capability) capability.textContent = settings.account.role === 'Tatuador' ? 'Acepta reservas y gestiona disponibilidad' : 'Descubre artistas y guarda ideas';

  document.querySelectorAll('[data-pro-only]').forEach(el=>{
    const input = el.querySelector('input');
    const isArtist = settings.account.role === 'Tatuador';
    el.classList.toggle('opacity-50', !isArtist);
    el.classList.toggle('border-dashed', !isArtist);
    if(input) input.disabled = !isArtist;
  });

  updateSolicitudesVisibility();
}

function updateSolicitudesVisibility(){
  const isArtist = settings.account.role === 'Tatuador';
  const tabBtn = document.querySelector('[data-tab="solicitudes"]');
  const tabSection = document.getElementById('tab-solicitudes');
  if(tabBtn) tabBtn.classList.toggle('hidden', !isArtist);
  if(tabSection) tabSection.classList.toggle('hidden', !isArtist);
  if(!isArtist && currentTab === 'solicitudes') switchTab('inicio');
}

function renderFilterForm(){
  const countrySel = document.getElementById('filterCountry');
  const regionSel = document.getElementById('filterRegion');
  const citySel = document.getElementById('filterCity');
  populateSelect(countrySel, Object.keys(geoCatalog));
  if(countrySel){
    if(!geoCatalog[searchFilters.country]) searchFilters.country = Object.keys(geoCatalog)[0];
    countrySel.value = searchFilters.country;
  }
  const regions = Object.keys(geoCatalog[searchFilters.country] || {});
  if(regions.length && !regions.includes(searchFilters.region)) searchFilters.region = regions[0];
  populateSelect(regionSel, regions);
  if(regionSel) regionSel.value = searchFilters.region;
  const cities = (geoCatalog[searchFilters.country] || {})[searchFilters.region] || [];
  if(cities.length && !cities.includes(searchFilters.city)) searchFilters.city = cities[0];
  populateSelect(citySel, cities);
  if(citySel) citySel.value = searchFilters.city;

  const radius = document.getElementById('filterRadius');
  const radiusVal = document.getElementById('filterRadiusValue');
  if(radius){ radius.value = searchFilters.radius; }
  if(radiusVal){ radiusVal.textContent = `${searchFilters.radius} km`; }

  const typeSel = document.getElementById('filterType');
  if(typeSel) typeSel.value = searchFilters.type;
  const styleSel = document.getElementById('filterStyle');
  if(styleSel) styleSel.value = searchFilters.style;
  const availSel = document.getElementById('filterAvailability');
  if(availSel) availSel.value = searchFilters.availability;
  const from = document.getElementById('filterFrom');
  if(from) from.value = searchFilters.from;
  const to = document.getElementById('filterTo');
  if(to) to.value = searchFilters.to;
  const remote = document.getElementById('filterRemote');
  if(remote) remote.checked = searchFilters.remote;
  const verified = document.getElementById('filterVerified');
  if(verified) verified.checked = searchFilters.verified;
}

function filterChip(label){
  const chip = document.createElement('span');
  chip.className = 'inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-800';
  chip.textContent = label;
  return chip;
}

function updateFilterSummary(){
  const wrap = document.getElementById('activeFilters');
  const chips = document.getElementById('filterChips');
  const defaults = defaultFilters();
  const entries = [];
  entries.push(`${searchFilters.city}, ${searchFilters.region} (${searchFilters.country})`);
  entries.push(`Radio ${searchFilters.radius} km`);
  entries.push(searchFilters.type);
  if(searchFilters.style && searchFilters.style !== 'Todos') entries.push(`Estilo ${searchFilters.style}`);
  if(searchFilters.availability) entries.push(searchFilters.availability);
  if(searchFilters.from || searchFilters.to) entries.push(`Fechas ${searchFilters.from || '—'} a ${searchFilters.to || '—'}`);
  if(searchFilters.remote) entries.push('Remoto disponible');
  if(searchFilters.verified) entries.push('Solo verificados');

  if(chips){
    chips.innerHTML = '';
    entries.forEach(text=> chips.appendChild(filterChip(text)));
    lucide.createIcons();
  }

  const hasDifferences = Object.keys(defaults).some(k => defaults[k] !== searchFilters[k]);
  if(wrap) wrap.classList.toggle('hidden', entries.length === 0 || !hasDifferences);
  renderSearchResults();
}

function syncFiltersWithDiscovery(){
  searchFilters.country = settings.discovery.country;
  searchFilters.region = settings.discovery.region;
  searchFilters.city = settings.discovery.city;
  searchFilters.radius = settings.discovery.radius;
  renderFilterForm();
  updateFilterSummary();
}

function renderInicio(){
  syncProfileWithSettings();
  const img = document.getElementById('carouselImg');
  img.src = demoImages[idx % demoImages.length];
  document.getElementById('carouselCounter').textContent = `${(idx%demoImages.length)+1}`;
  const pubBy = document.getElementById('pubBy');
  if (pubBy && pubBy.firstChild) pubBy.firstChild.textContent = profile.name + ' ';
  document.getElementById('pubUser').textContent = '@' + profile.username;
  const list = document.getElementById('commentsList'); list.innerHTML = '';
  demoComments.forEach(c=>{
    const row = document.createElement('div');
    row.className = 'group flex items-start gap-2 rounded-xl p-2 hover:bg-violet-50/60';
    row.innerHTML = `<div class="grid h-8 w-8 place-items-center rounded-full bg-violet-200 text-xs font-semibold text-violet-800">${c.user.charAt(0)}</div>
      <div class="min-w-0 flex-1"><div class="mb-0.5 text-xs font-medium text-slate-700">${c.user}</div><p class="text-sm text-slate-700">${c.text}</p></div>`;
    list.appendChild(row);
  });
  document.getElementById('commentsCount').textContent = demoComments.length;
  setIconFilled(document.getElementById('likeBtn'), liked);
  setIconFilled(document.getElementById('saveBtn'), saved);
  lucide.createIcons();
}

function renderCalendar(){
  const cal = document.getElementById('calendarGrid');
  if (!cal) return;
  cal.innerHTML = '';
  for(let i=1;i<=28;i++){
    const d = document.createElement('div');
    d.textContent = i;
    d.className = `rounded-md p-2 ${[4,10,18].includes(i)?'bg-violet-100 text-violet-800':'bg-slate-50'}`;
    cal.appendChild(d);
  }
}

function renderReservas(){
  const cont = document.getElementById('reservasList'); cont.innerHTML = '';
  reservasSeed.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'flex cursor-pointer items-center justify-between rounded-xl border p-3 transition border-violet-100 hover:bg-violet-50/50';
    card.innerHTML = `<div><div class="text-sm font-medium">Sesión #${r.id} · ${r.style}</div><div class="text-xs text-slate-500">${r.time}</div></div>
      <div class="flex gap-2"><button class="rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white">Confirmar</button><button class="rounded-lg border border-violet-200 px-3 py-1.5 text-xs">Reprogramar</button></div>`;
    card.addEventListener('click', ()=>{
      selectReserva(r);
      Array.from(cont.children).forEach(el=>el.classList.remove('border-violet-300','bg-violet-50'));
      card.classList.add('border-violet-300','bg-violet-50');
    });
    cont.appendChild(card);
  });
  renderCalendar();
  selectReserva(reservasSeed[0]);
  lucide.createIcons();
}

function selectReserva(r){
  const map = document.getElementById('mapFrame');
  if (map) map.src = miniMapUrl(r.lat, r.lon);
  const lab = document.getElementById('mapLabel');
  if (lab) lab.textContent = r.label;
}

function renderFavoritos(){
  const grid = document.getElementById('favoritosGrid'); grid.innerHTML = '';
  for(let i=0;i<6;i++){
    const card = document.createElement('div');
    card.className = 'group overflow-hidden rounded-2xl border border-violet-100';
    card.innerHTML = `<div class="relative aspect-[4/3]"><img src="${demoImages[i%demoImages.length]}" class="h-full w-full object-cover"/><button class="absolute right-2 top-2 rounded-full bg-white/90 p-2 card"><i data-lucide="heart" class="h-4 w-4"></i></button></div>
    <div class="flex items-center justify-between p-3"><div><div class="text-sm font-medium">Artista ${i+1}</div><div class="text-xs text-slate-500">Neo-trad · Santiago</div></div><button class="rounded-full bg-violet-600 px-3 py-1.5 text-xs text-white">Reservar</button></div>`;
    grid.appendChild(card);
  }
  lucide.createIcons();
}

function renderSolicitudes(){
  const list = document.getElementById('solicitudesList'); list.innerHTML='';
  [1,2,3,4].forEach(i=>{
    const row = document.createElement('div');
    row.className = 'flex items-start justify-between gap-3 rounded-xl border border-violet-100 p-3';
    row.innerHTML = `<div><div class="text-sm font-medium">Cliente ${i}</div><div class="text-xs text-slate-500">"Quiero un tatuaje minimalista en el antebrazo"</div></div><div class="flex gap-2"><button class="rounded-lg border border-violet-200 px-3 py-1.5 text-xs">Pedir más info</button><button class="rounded-lg bg-violet-600 px-3 py-1.5 text-xs text-white">Aceptar</button></div>`;
    list.appendChild(row);
  });
}

function renderMensajes(){
  const list = document.getElementById('dmList'); list.innerHTML='';
  dm.forEach(t=>{
    const btn = document.createElement('button');
    btn.className = `w-full rounded-xl border p-3 text-left ${t.id===activeDm?'border-violet-300 bg-violet-50':'border-violet-100 hover:bg-violet-50/50'}`;
    btn.innerHTML = `<div class="flex items-center justify-between"><div class="text-sm font-medium">${t.user}</div><div class="text-xs text-slate-500">${t.time}</div></div><div class="text-xs text-slate-500 truncate">${t.preview}</div>`;
    btn.addEventListener('click', ()=>{ activeDm = t.id; renderMensajes(); });
    list.appendChild(btn);
  });
  const threadBox = document.getElementById('dmThread'); threadBox.innerHTML='';
  const thr = (dm.find(x=>x.id===activeDm)||{thread:[]}).thread;
  thr.forEach(m=>{
    const b = document.createElement('div');
    b.className = `max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.from==='Tú'?'ml-auto bg-violet-600 text-white':'bg-violet-50 text-slate-700'}`;
    b.textContent = m.text; threadBox.appendChild(b);
  });
  lucide.createIcons();
}

function renderGuardados(){
  const grid = document.getElementById('guardadosGrid'); grid.innerHTML='';
  for(let i=0;i<8;i++){
    const c = document.createElement('div');
    c.className = 'rounded-xl border border-violet-100 p-3';
    c.innerHTML = `<div class="mb-2 h-28 w-full rounded-lg bg-gradient-to-br from-violet-100 to-sky-100"></div><div class="text-sm">Idea #${i+1}</div><div class="text-xs text-slate-500">Notas rápidas del proyecto</div>`;
    grid.appendChild(c);
  }
}

function renderPerfil(){
  syncProfileWithSettings();
  document.getElementById('perfilNombre').textContent = profile.name;
  document.getElementById('perfilUser').textContent = `@${profile.username} · ${profile.location}`;
  document.getElementById('perfilBio').textContent = profile.bio;
  const grid = document.getElementById('perfilPosts'); grid.innerHTML='';
  posts.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'overflow-hidden rounded-2xl border border-violet-100';
    card.innerHTML = `<div class="relative aspect-[4/3]"><img src="${p.img}" alt="${p.title}" class="h-full w-full object-cover"/><div class="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs">${p.style}</div></div><div class="flex items-center justify-between p-3"><div><div class="text-sm font-medium">${p.title}</div><div class="text-xs text-slate-500">${p.caption}</div></div><button class="rounded-full border border-violet-200 px-3 py-1.5 text-xs">Contactar</button></div>`;
    grid.appendChild(card);
  });
  document.getElementById('countPosts').textContent = posts.length;
  const accountSelect = document.getElementById('accountType');
  if(accountSelect) accountSelect.value = settings.account.role;
}

function renderConfig(){
  const countrySel = document.getElementById('configCountry');
  const regionSel = document.getElementById('configRegion');
  const citySel = document.getElementById('configCity');

  populateSelect(countrySel, Object.keys(geoCatalog));
  countrySel.value = settings.discovery.country;

  const regions = Object.keys(geoCatalog[settings.discovery.country] || {});
  if(regions.length && !regions.includes(settings.discovery.region)) settings.discovery.region = regions[0];
  populateSelect(regionSel, regions);
  regionSel.value = settings.discovery.region;

  const cities = (geoCatalog[settings.discovery.country] || {})[settings.discovery.region] || [];
  if(cities.length && !cities.includes(settings.discovery.city)) settings.discovery.city = cities[0];
  populateSelect(citySel, cities);
  citySel.value = settings.discovery.city;

  document.getElementById('configRadius').value = settings.discovery.radius;
  document.getElementById('configRadiusValue').textContent = `${settings.discovery.radius} km`;
  document.getElementById('configStyle').value = settings.discovery.style;
  document.getElementById('configNearby').checked = settings.discovery.nearby;
  document.getElementById('configNewTalent').checked = settings.discovery.newTalent;
  document.getElementById('configSafe').checked = settings.discovery.safe;

  document.getElementById('configName').value = settings.profile.name;
  document.getElementById('configEmail').value = settings.profile.email;
  document.getElementById('configLanguage').value = settings.profile.language;
  document.getElementById('configTimezone').value = settings.profile.timezone;
  document.getElementById('configNoti').checked = settings.profile.notifications;
  document.getElementById('configDigest').checked = settings.profile.digest;

  document.getElementById('roleArtist').checked = settings.account.role === 'Tatuador';
  document.getElementById('roleUser').checked = settings.account.role !== 'Tatuador';
  document.getElementById('configBookings').checked = settings.account.bookings;
  document.getElementById('configShowPortfolio').checked = settings.account.showPortfolio;
  document.getElementById('configMessages').checked = settings.account.messagesOpen;

  document.getElementById('summaryRole').textContent = settings.account.role === 'Tatuador'
    ? 'Modo profesional: con agenda, solicitudes y portafolio activado.'
    : 'Modo usuario: inspirarte, guardar ideas y contactar artistas.';
  document.getElementById('summaryLocation').textContent = `Ves publicaciones desde ${settings.discovery.city}, ${settings.discovery.region} (${settings.discovery.country}).`;
  document.getElementById('summaryFilters').textContent = `Radio ${settings.discovery.radius} km · Estilo: ${settings.discovery.style} · Preferencias activas: ${[
    settings.discovery.nearby ? 'cercanía' : null,
    settings.discovery.newTalent ? 'nuevos talentos' : null,
    settings.discovery.safe ? 'modo seguro' : null
  ].filter(Boolean).join(', ') || 'ninguna'}`;

  syncFiltersWithDiscovery();
  applyRoleUI();
  lucide.createIcons();
}

function bindFilterPanel(){
  const toggle = document.getElementById('filterToggle');
  const close = document.getElementById('filterClose');
  const panel = document.getElementById('filterPanel');
  const reset = document.getElementById('filterReset');
  const apply = document.getElementById('filterApply');
  const clearFromSummary = document.getElementById('filtersClearFromSummary');

  const countrySel = document.getElementById('filterCountry');
  const regionSel = document.getElementById('filterRegion');
  const citySel = document.getElementById('filterCity');
  const radius = document.getElementById('filterRadius');
  const typeSel = document.getElementById('filterType');
  const styleSel = document.getElementById('filterStyle');
  const availabilitySel = document.getElementById('filterAvailability');
  const from = document.getElementById('filterFrom');
  const to = document.getElementById('filterTo');
  const remote = document.getElementById('filterRemote');
  const verified = document.getElementById('filterVerified');

  const closePanel = ()=> panel && panel.classList.add('hidden');
  const openPanel = ()=>{ if(panel) panel.classList.remove('hidden'); renderFilterForm(); };

  if(toggle) toggle.addEventListener('click', ()=>{ panel?.classList.contains('hidden') ? openPanel() : closePanel(); });
  if(close) close.addEventListener('click', closePanel);

  if(countrySel) countrySel.addEventListener('change', ()=>{ searchFilters.country = countrySel.value; renderFilterForm(); updateFilterSummary(); });
  if(regionSel) regionSel.addEventListener('change', ()=>{ searchFilters.region = regionSel.value; renderFilterForm(); updateFilterSummary(); });
  if(citySel) citySel.addEventListener('change', ()=>{ searchFilters.city = citySel.value; updateFilterSummary(); });
  if(radius) radius.addEventListener('input', ()=>{ searchFilters.radius = parseInt(radius.value, 10) || searchFilters.radius; const label=document.getElementById('filterRadiusValue'); if(label) label.textContent = `${searchFilters.radius} km`; });
  if(radius) radius.addEventListener('change', ()=>{ updateFilterSummary(); });
  if(typeSel) typeSel.addEventListener('change', ()=>{ searchFilters.type = typeSel.value; updateFilterSummary(); });
  if(styleSel) styleSel.addEventListener('change', ()=>{ searchFilters.style = styleSel.value; updateFilterSummary(); });
  if(availabilitySel) availabilitySel.addEventListener('change', ()=>{ searchFilters.availability = availabilitySel.value; updateFilterSummary(); });
  if(from) from.addEventListener('change', ()=>{ searchFilters.from = from.value; updateFilterSummary(); });
  if(to) to.addEventListener('change', ()=>{ searchFilters.to = to.value; updateFilterSummary(); });
  if(remote) remote.addEventListener('change', ()=>{ searchFilters.remote = remote.checked; updateFilterSummary(); });
  if(verified) verified.addEventListener('change', ()=>{ searchFilters.verified = verified.checked; updateFilterSummary(); });

  if(reset) reset.addEventListener('click', ()=>{ searchFilters = defaultFilters(); renderFilterForm(); updateFilterSummary(); });
  if(clearFromSummary) clearFromSummary.addEventListener('click', ()=>{ searchFilters = defaultFilters(); renderFilterForm(); updateFilterSummary(); });

  if(apply) apply.addEventListener('click', ()=>{ updateFilterSummary(); closePanel(); });

  renderFilterForm();
  updateFilterSummary();
}

function applySearchFilters(){
  return searchCatalog.filter(item=>{
    if(item.country !== searchFilters.country) return false;
    if(item.region !== searchFilters.region) return false;
    if(item.city !== searchFilters.city) return false;
    if(item.distance > searchFilters.radius) return false;
    if(searchFilters.type && searchFilters.type !== item.type) return false;
    if(searchFilters.style && searchFilters.style !== 'Todos' && searchFilters.style !== item.style) return false;
    if(searchFilters.availability && searchFilters.availability !== item.availability) return false;
    if(searchFilters.from && item.date < searchFilters.from) return false;
    if(searchFilters.to && item.date > searchFilters.to) return false;
    if(searchFilters.remote && !item.remote) return false;
    if(searchFilters.verified && !item.verified) return false;
    return true;
  });
}

function renderSearchResults(){
  const grid = document.getElementById('searchResults');
  const counter = document.getElementById('searchResultsCount');
  if(!grid || !counter) return;
  grid.innerHTML = '';
  const results = applySearchFilters();
  counter.textContent = `${results.length} resultado${results.length!==1?'s':''} según tus filtros`;
  if(results.length === 0){
    const empty = document.createElement('div');
    empty.className = 'rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-4 text-sm text-slate-600';
    empty.textContent = 'No encontramos coincidencias con los filtros actuales. Ajusta el rango o cambia el tipo para ver más opciones.';
    grid.appendChild(empty);
    return;
  }
  results.forEach(res=>{
    const card = document.createElement('div');
    card.className = 'rounded-2xl border border-violet-100 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200';
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold text-violet-900">${res.title}</div>
        <span class="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700">${res.type}</span>
      </div>
      <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1"><i data-lucide="map-pin" class="h-3.5 w-3.5 text-violet-600"></i>${res.city}, ${res.region}</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1"><i data-lucide="locate" class="h-3.5 w-3.5 text-violet-600"></i>${res.distance} km</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1"><i data-lucide="calendar" class="h-3.5 w-3.5 text-violet-600"></i>${res.availability}</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1"><i data-lucide="sparkles" class="h-3.5 w-3.5 text-violet-600"></i>${res.style}</span>
        ${res.remote ? '<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700"><i data-lucide="radio" class="h-3.5 w-3.5"></i>Remoto</span>' : ''}
        ${res.verified ? '<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-emerald-700"><i data-lucide="shield-check" class="h-3.5 w-3.5"></i>Verificado</span>' : ''}
      </div>
      <div class="mt-2 flex items-center justify-between text-xs text-slate-600">
        <div class="flex items-center gap-2">
          <span class="inline-grid h-7 w-7 place-items-center rounded-full bg-violet-100 text-[11px] font-semibold text-violet-800">${res.artist[0]}</span>
          <div>
            <div class="font-semibold text-slate-800">${res.artist}</div>
            <div class="text-[11px] text-slate-500">${res.country} · ${res.date}</div>
          </div>
        </div>
        <div class="flex gap-2">
          <button class="rounded-lg border border-violet-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-violet-50">Guardar</button>
          <button class="rounded-lg bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-violet-700">Ver detalles</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  lucide.createIcons();
}

function feedCard(post){
  const card = document.createElement('article');
  card.className = 'overflow-hidden rounded-2xl border border-violet-100 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200';
  card.innerHTML = `
    <div class="relative aspect-[16/10]">
      <img src="${post.img}" alt="${post.title}" class="h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      <button class="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 card"><i data-lucide="bookmark" class="h-4 w-4"></i></button>
    </div>
    <div class="space-y-2 p-4">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold text-violet-900">${post.title}</div>
        <span class="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700">${post.style}</span>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1"><i data-lucide="user" class="h-3.5 w-3.5 text-violet-600"></i>${post.artist}</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1"><i data-lucide="map-pin" class="h-3.5 w-3.5 text-violet-600"></i>${post.city}, ${post.country}</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1"><i data-lucide="locate" class="h-3.5 w-3.5 text-violet-600"></i>${post.distance} km</span>
        <span class="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1"><i data-lucide="calendar" class="h-3.5 w-3.5 text-violet-600"></i>${post.availability}</span>
      </div>
      <div class="flex items-center justify-between text-xs text-slate-600">
        <div class="flex items-center gap-2">
          <span class="inline-grid h-8 w-8 place-items-center rounded-full bg-violet-100 text-xs font-semibold text-violet-800">${post.artist[0]}</span>
          <div>
            <div class="font-semibold text-slate-800">${post.artist}</div>
            <div class="text-[11px] text-slate-500">Publicación destacada</div>
          </div>
        </div>
        <button class="rounded-lg bg-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-violet-700">Reservar</button>
      </div>
    </div>
  `;
  return card;
}

function updateFeedCounter(){
  const counter = document.getElementById('feedCounter');
  if(!counter) return;
  counter.textContent = `${feedLoaded} de ${tattooerFeed.length} publicaciones`;
}

function updateFeedStatus(){
  const status = document.getElementById('feedStatus');
  if(!status) return;
  if(feedLoaded >= tattooerFeed.length){
    status.textContent = 'Has visto todas las publicaciones disponibles.';
  } else {
    status.textContent = 'Desliza para seguir viendo más trabajos.';
  }
}

function appendFeedBatch(){
  const list = document.getElementById('tattooerFeed');
  if(!list) return;
  if(feedLoaded >= tattooerFeed.length){ updateFeedStatus(); return; }
  const next = tattooerFeed.slice(feedLoaded, feedLoaded + FEED_BATCH);
  next.forEach(post => list.appendChild(feedCard(post)));
  feedLoaded += next.length;
  updateFeedCounter();
  updateFeedStatus();
  lucide.createIcons();
}

function resetFeed(){
  const list = document.getElementById('tattooerFeed');
  if(!list) return;
  list.innerHTML = '';
  feedLoaded = 0;
  appendFeedBatch();
}

function initInfiniteFeed(){
  const sentinel = document.getElementById('feedSentinel');
  resetFeed();
  if(feedObserver) feedObserver.disconnect();
  if(!sentinel) return;
  feedObserver = new IntersectionObserver(entries => {
    if(entries.some(e => e.isIntersecting)) appendFeedBatch();
  }, { rootMargin: '200px' });
  feedObserver.observe(sentinel);
}

function initPublish(){
  const title = document.getElementById('pubTitle');
  const desc = document.getElementById('pubDesc');
  const styleSel = document.getElementById('pubStyle');
  const imgInput = document.getElementById('pubImages');
  const prevTitle = document.getElementById('previewTitle');
  const prevDesc = document.getElementById('previewDesc');
  const prevStyle = document.getElementById('previewStyle');
  title.addEventListener('input', ()=> prevTitle.textContent = title.value || 'Título del trabajo');
  desc.addEventListener('input', ()=> prevDesc.textContent = desc.value || 'Descripción...');
  styleSel.addEventListener('change', ()=> prevStyle.textContent = styleSel.value);
  imgInput.addEventListener('change', ()=>{ const info=document.getElementById('pubImagesInfo'); info.classList.toggle('hidden', imgInput.files.length===0); info.textContent = `${imgInput.files.length} archivo(s) seleccionados`; });
  document.getElementById('publishForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!title.value.trim() || !desc.value.trim()) return;
    const newPost = { id: Date.now(), img: demoImages[posts.length % demoImages.length], title: title.value.trim(), style: styleSel.value, caption: desc.value.trim(), likes: 0, saved: false };
    posts = [newPost, ...posts];
    title.value=''; desc.value=''; prevTitle.textContent='Título del trabajo'; prevDesc.textContent='Descripción...';
    switchTab('perfil');
  });
}

function bindConfigEvents(){
  const countrySel = document.getElementById('configCountry');
  const regionSel = document.getElementById('configRegion');
  const citySel = document.getElementById('configCity');
  const radius = document.getElementById('configRadius');
  const styleSel = document.getElementById('configStyle');
  const nearby = document.getElementById('configNearby');
  const newTalent = document.getElementById('configNewTalent');
  const safe = document.getElementById('configSafe');

  const nameInput = document.getElementById('configName');
  const emailInput = document.getElementById('configEmail');
  const languageSel = document.getElementById('configLanguage');
  const timezoneSel = document.getElementById('configTimezone');
  const noti = document.getElementById('configNoti');
  const digest = document.getElementById('configDigest');

  if(countrySel) countrySel.addEventListener('change', ()=>{ settings.discovery.country = countrySel.value; renderConfig(); renderInicio(); renderPerfil(); });
  if(regionSel) regionSel.addEventListener('change', ()=>{ settings.discovery.region = regionSel.value; renderConfig(); renderInicio(); renderPerfil(); });
  if(citySel) citySel.addEventListener('change', ()=>{ settings.discovery.city = citySel.value; renderConfig(); renderInicio(); renderPerfil(); });
  if(radius) radius.addEventListener('input', ()=>{ settings.discovery.radius = parseInt(radius.value, 10) || settings.discovery.radius; document.getElementById('configRadiusValue').textContent = `${settings.discovery.radius} km`; });
  if(radius) radius.addEventListener('change', ()=> renderConfig());
  if(styleSel) styleSel.addEventListener('change', ()=>{ settings.discovery.style = styleSel.value; renderConfig(); });
  if(nearby) nearby.addEventListener('change', ()=>{ settings.discovery.nearby = nearby.checked; renderConfig(); });
  if(newTalent) newTalent.addEventListener('change', ()=>{ settings.discovery.newTalent = newTalent.checked; renderConfig(); });
  if(safe) safe.addEventListener('change', ()=>{ settings.discovery.safe = safe.checked; renderConfig(); });

  if(nameInput) nameInput.addEventListener('input', ()=>{ settings.profile.name = nameInput.value; renderInicio(); renderPerfil(); });
  if(emailInput) emailInput.addEventListener('input', ()=>{ settings.profile.email = emailInput.value; });
  if(languageSel) languageSel.addEventListener('change', ()=>{ settings.profile.language = languageSel.value; });
  if(timezoneSel) timezoneSel.addEventListener('change', ()=>{ settings.profile.timezone = timezoneSel.value; });
  if(noti) noti.addEventListener('change', ()=>{ settings.profile.notifications = noti.checked; });
  if(digest) digest.addEventListener('change', ()=>{ settings.profile.digest = digest.checked; });

  document.querySelectorAll('input[name="accountRole"]').forEach(radio=> radio.addEventListener('change', ()=>{
    settings.account.role = radio.value;
    applyRoleUI();
    renderConfig();
    renderPerfil();
  }));

  const bookings = document.getElementById('configBookings');
  const showPortfolio = document.getElementById('configShowPortfolio');
  const messages = document.getElementById('configMessages');
  if(bookings) bookings.addEventListener('change', ()=>{ settings.account.bookings = bookings.checked; });
  if(showPortfolio) showPortfolio.addEventListener('change', ()=>{ settings.account.showPortfolio = showPortfolio.checked; });
  if(messages) messages.addEventListener('change', ()=>{ settings.account.messagesOpen = messages.checked; });

  const accountSelect = document.getElementById('accountType');
  if(accountSelect) accountSelect.addEventListener('change', ()=>{ settings.account.role = accountSelect.value; renderConfig(); renderPerfil(); });

  const saveBtn = document.getElementById('configSave');
  if(saveBtn) saveBtn.addEventListener('click', ()=>{ renderConfig(); renderInicio(); renderPerfil(); });
}

function switchTab(name){
  const isArtist = settings.account.role === 'Tatuador';
  if(name==='solicitudes' && !isArtist) name = 'inicio';
  document.querySelectorAll('[id^="tab-"]').forEach(sec=>sec.classList.add('hidden'));
  const sec = document.getElementById(`tab-${name}`); if(sec) sec.classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    const active = btn.getAttribute('data-tab')===name;
    btn.className = `tab-btn group flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm transition ${active? 'bg-violet-100 text-violet-900':'text-slate-700 hover:bg-violet-50'}`;
    const i = btn.querySelector('i'); if(i){ i.className = `h-4 w-4 ${active? 'text-violet-700':'text-slate-500'}`; }
  });
  if(name==='inicio') renderInicio();
  if(name==='reservados') renderReservas();
  if(name==='favoritos') renderFavoritos();
  if(name==='solicitudes') renderSolicitudes();
  if(name==='mensajes') renderMensajes();
  if(name==='guardados') renderGuardados();
  if(name==='perfil') renderPerfil();
  if(name==='publicar') initPublish();
  if(name==='config') renderConfig();
  lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentTab = name;
}

function initApp(){
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('carouselImg').src = demoImages[0];
  const pubBy = document.getElementById('pubBy');
  if (pubBy && pubBy.firstChild) pubBy.firstChild.textContent = profile.name + ' ';
  document.getElementById('pubUser').textContent = '@'+profile.username;

  document.getElementById('prevBtn').addEventListener('click', ()=>{ idx = (idx - 1 + demoImages.length) % demoImages.length; renderInicio(); });
  document.getElementById('nextBtn').addEventListener('click', ()=>{ idx = (idx + 1) % demoImages.length; renderInicio(); });
  document.getElementById('likeBtn').addEventListener('click', ()=>{ liked=!liked; renderInicio(); });
  document.getElementById('saveBtn').addEventListener('click', ()=>{ saved=!saved; renderInicio(); });
  document.getElementById('commentSend').addEventListener('click', ()=>{
    const inp = document.getElementById('commentInput'); const t = inp.value.trim(); if(!t) return; demoComments = [...demoComments, {id: Date.now(), user: 'Tú', text: t}]; inp.value=''; renderInicio();
  });

  document.getElementById('dmSend').addEventListener('click', ()=>{
    const inp = document.getElementById('dmInput'); const t = inp.value.trim(); if(!t) return; dm = dm.map(x=> x.id===activeDm ? ({...x, thread:[...x.thread, {from:'Tú', text:t}], preview:t, time:'Ahora'}) : x); inp.value=''; renderMensajes();
  });

  document.getElementById('btnSidebar').addEventListener('click', ()=>{
    document.getElementById('sidebar').classList.toggle('hidden');
  });
  document.getElementById('btnRight').addEventListener('click', ()=>{
    rightOpen = !rightOpen; document.getElementById('rightCol').classList.toggle('hidden', !rightOpen);
  });
  document.getElementById('btnLogout').addEventListener('click', ()=>{ document.getElementById('app').classList.add('hidden'); document.getElementById('auth').classList.remove('hidden'); });

  document.querySelectorAll('.tab-btn').forEach(btn=> btn.addEventListener('click', ()=> switchTab(btn.getAttribute('data-tab'))));

  bindConfigEvents();
  bindFilterPanel();
  applyRoleUI();
  initInfiniteFeed();
  renderConfig();
  switchTab('inicio');
  lucide.createIcons();
}

function initAuthTabs(){
  const authTabs = [
    { btn: document.getElementById('authTabLogin'), form: document.getElementById('loginForm'), title: 'Iniciar sesión', subtitle: 'Accede a tu cuenta para publicar y reservar.' },
    { btn: document.getElementById('authTabRegister'), form: document.getElementById('registerForm'), title: 'Crear cuenta', subtitle: 'Elige tu rol, crea tu perfil y entra al panel.' }
  ];
  authTabs.forEach(tab=>{
    if(!tab.btn || !tab.form) return;
    tab.btn.addEventListener('click', (e)=>{
      e.preventDefault();
      authTabs.forEach(t=>{
        if(t.form) t.form.classList.toggle('hidden', t!==tab);
        if(t.btn) t.btn.className = t===tab ? 'rounded-xl bg-white px-3 py-2 text-violet-900 shadow' : 'rounded-xl px-3 py-2 text-violet-600';
      });
      const title = document.getElementById('authTitle');
      const subtitle = document.getElementById('authSubtitle');
      if(title) title.textContent = tab.title;
      if(subtitle) subtitle.textContent = tab.subtitle;
      lucide.createIcons();
    });
  });
}

// Auth
initAuthTabs();
document.getElementById('loginForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const sessionRole = (document.querySelector('input[name="loginRole"]:checked') || { value: settings.account.role }).value;
  const error = document.getElementById('loginError');
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!okEmail){ error.textContent = 'Ingresa un correo válido'; error.classList.remove('hidden'); return; }
  if(pass.length < 6){ error.textContent = 'La contraseña debe tener al menos 6 caracteres'; error.classList.remove('hidden'); return; }
  error.classList.add('hidden');
  settings.account.role = sessionRole;
  settings.account.entryProfile = sessionRole;
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  initApp();
});

document.getElementById('registerForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('regName').value.trim() || 'Nuevo usuario';
  const username = document.getElementById('regUsername').value.trim() || 'nuevo.usuario';
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value;
  const pass2 = document.getElementById('regPassConfirm').value;
  const role = (document.querySelector('input[name="regRole"]:checked') || { value: settings.account.role }).value;
  const profileMode = (document.querySelector('input[name="regProfileMode"]:checked') || { value: role }).value;
  const error = document.getElementById('registerError');
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!okEmail){ error.textContent = 'Ingresa un correo válido'; error.classList.remove('hidden'); return; }
  if(pass.length < 6){ error.textContent = 'La contraseña debe tener al menos 6 caracteres'; error.classList.remove('hidden'); return; }
  if(pass !== pass2){ error.textContent = 'Las contraseñas no coinciden'; error.classList.remove('hidden'); return; }
  error.classList.add('hidden');
  settings.profile.name = name;
  profile.name = name;
  settings.profile.email = email;
  settings.account.role = profileMode;
  settings.account.entryProfile = profileMode;
  profile.username = username.replace(/[^a-zA-Z0-9._-]/g,'') || 'perfil';
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  initApp();
});

const linkToRegister = document.getElementById('linkToRegister');
if(linkToRegister) linkToRegister.addEventListener('click', ()=>{ document.getElementById('authTabRegister').click(); });

const linkToLogin = document.getElementById('linkToLogin');
if(linkToLogin) linkToLogin.addEventListener('click', ()=>{ document.getElementById('authTabLogin').click(); });

document.getElementById('togglePass').addEventListener('click', ()=>{
  const inp = document.getElementById('loginPass');
  const icon = document.querySelector('#togglePass i');
  if(inp.type==='password'){ inp.type='text'; icon.setAttribute('data-lucide','eye-off'); }
  else { inp.type='password'; icon.setAttribute('data-lucide','eye'); }
  lucide.createIcons();
});

// initial icon render
lucide.createIcons();
