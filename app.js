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
let accountType = 'Personal';

let idx = 0;
let liked = false;
let saved = false;
let rightOpen = true;

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

function renderInicio(){
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

function switchTab(name){
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
  lucide.createIcons();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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

  switchTab('inicio');
  lucide.createIcons();
}

// Auth
document.getElementById('loginForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const error = document.getElementById('loginError');
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!okEmail){ error.textContent = 'Ingresa un correo válido'; error.classList.remove('hidden'); return; }
  if(pass.length < 6){ error.textContent = 'La contraseña debe tener al menos 6 caracteres'; error.classList.remove('hidden'); return; }
  error.classList.add('hidden');
  document.getElementById('auth').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  initApp();
});

document.getElementById('togglePass').addEventListener('click', ()=>{
  const inp = document.getElementById('loginPass');
  const icon = document.querySelector('#togglePass i');
  if(inp.type==='password'){ inp.type='text'; icon.setAttribute('data-lucide','eye-off'); }
  else { inp.type='password'; icon.setAttribute('data-lucide','eye'); }
  lucide.createIcons();
});

// initial icon render
lucide.createIcons();
