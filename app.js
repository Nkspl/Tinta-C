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
    bookings: true,
    showPortfolio: true,
    messagesOpen: true
  }
};

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

  applyRoleUI();
  lucide.createIcons();
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
  applyRoleUI();
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
