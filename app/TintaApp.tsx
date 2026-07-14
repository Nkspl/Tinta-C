"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Compass,
  Ellipsis,
  ExternalLink,
  Heart,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Artist,
  Booking,
  Conversation,
  artists,
  formatClp,
  initialRequests,
  portfolioSeed,
  seededBookings,
  seededConversations,
} from "./data";

type Role = "client" | "artist";
type View = "discover" | "bookings" | "messages" | "favorites" | "dashboard" | "portfolio" | "settings";

const styleOptions = ["Todos", "Fine line", "Blackwork", "Realismo", "Neo tradicional", "Botánico"];
const times = ["10:00", "11:30", "14:00", "15:30", "17:00"];

const clientNav = [
  { id: "discover" as View, label: "Descubrir", icon: Compass },
  { id: "bookings" as View, label: "Mis reservas", icon: CalendarDays },
  { id: "messages" as View, label: "Mensajes", icon: MessageCircle, badge: 2 },
  { id: "favorites" as View, label: "Favoritos", icon: Heart },
];

const artistNav = [
  { id: "dashboard" as View, label: "Panel", icon: LayoutDashboard },
  { id: "bookings" as View, label: "Agenda", icon: CalendarDays },
  { id: "messages" as View, label: "Mensajes", icon: MessageCircle, badge: 2 },
  { id: "portfolio" as View, label: "Portafolio", icon: Palette },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="Tinta">
      <span className="brand-mark" aria-hidden="true">T</span>
      {!compact && (
        <span className="brand-copy">
          <strong>Tinta</strong>
          <small>arte que permanece</small>
        </span>
      )}
    </div>
  );
}

function Welcome({ onEnter }: { onEnter: (role: Role) => void }) {
  return (
    <main className="welcome-shell">
      <header className="welcome-nav">
        <Logo />
        <div className="welcome-nav-actions">
          <span className="demo-pill"><span /> Demo interactiva</span>
          <button className="button button-ghost" onClick={() => onEnter("artist")}>Soy tatuador</button>
        </div>
      </header>

      <section className="welcome-grid">
        <div className="welcome-copy">
          <div className="eyebrow"><Sparkles size={15} /> La forma simple de encontrar tu próximo artista</div>
          <h1>Tu historia merece<br /><em>la tinta correcta.</em></h1>
          <p className="welcome-lead">
            Descubre tatuadores verificados en Santiago, compara portafolios y reserva tu sesión con claridad desde el primer mensaje.
          </p>
          <div className="welcome-actions">
            <button className="button button-primary button-large" onClick={() => onEnter("client")}>
              Explorar artistas <ArrowRight size={18} />
            </button>
            <button className="button button-secondary button-large" onClick={() => onEnter("artist")}>
              Ver panel profesional
            </button>
          </div>
          <div className="trust-row" aria-label="Ventajas de Tinta">
            <span><ShieldCheck size={17} /> Artistas verificados</span>
            <span><WalletCards size={17} /> Precios transparentes</span>
            <span><CalendarDays size={17} /> Reserva en línea</span>
          </div>
        </div>

        <div className="welcome-visual" aria-label="Selección de trabajos y artistas">
          <div className="welcome-orbit orbit-one" />
          <div className="welcome-orbit orbit-two" />
          <article className="hero-photo hero-photo-main">
            <img src={artists[0].cover} alt="Trabajo de tatuaje fine line" />
            <div className="hero-photo-caption">
              <div>
                <span className="caption-kicker">Selección de la semana</span>
                <strong>Botánica en movimiento</strong>
              </div>
              <span className="round-icon"><ArrowRight size={18} /></span>
            </div>
          </article>
          <article className="hero-photo hero-photo-small">
            <img src={artists[1].cover} alt="Trabajo de tatuaje blackwork" />
            <span>Blackwork</span>
          </article>
          <div className="artist-floating-card">
            <img src={artists[0].avatar} alt="Camila Reyes" />
            <div><strong>Camila Reyes</strong><span><Star size={12} fill="currentColor" /> 4,9 · Providencia</span></div>
            <BadgeCheck size={20} />
          </div>
          <div className="social-proof">
            <div className="avatar-stack">
              {artists.slice(0, 3).map((artist) => <img key={artist.id} src={artist.avatar} alt="" />)}
            </div>
            <div><strong>+1.200</strong><span>reservas completadas</span></div>
          </div>
        </div>
      </section>

      <footer className="welcome-footer">
        <span>Hecho para la comunidad creativa de Chile.</span>
        <span>Fotografías de demostración: Unsplash.</span>
      </footer>
    </main>
  );
}

function Sidebar({
  role,
  view,
  favoritesCount,
  onNavigate,
  onRoleChange,
  onLogout,
  mobileOpen,
  onClose,
}: {
  role: Role;
  view: View;
  favoritesCount: number;
  onNavigate: (view: View) => void;
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const nav = role === "artist" ? artistNav : clientNav;

  return (
    <>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Cerrar menú" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="icon-button sidebar-close" aria-label="Cerrar menú" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="role-switcher" role="group" aria-label="Modo de cuenta">
          <button className={role === "client" ? "active" : ""} onClick={() => onRoleChange("client")}>Cliente</button>
          <button className={role === "artist" ? "active" : ""} onClick={() => onRoleChange("artist")}>Artista</button>
        </div>

        <nav className="primary-nav" aria-label="Navegación principal">
          <span className="nav-label">Menú</span>
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={view === item.id ? "active" : ""}
                onClick={() => { onNavigate(item.id); onClose(); }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.id === "favorites" && favoritesCount > 0 && <b>{favoritesCount}</b>}
                {item.badge && <b>{item.badge}</b>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-promo">
          <span className="promo-icon"><Sparkles size={19} /></span>
          <strong>{role === "artist" ? "Haz crecer tu agenda" : "¿Tienes una idea?"}</strong>
          <p>{role === "artist" ? "Completa tu perfil para aparecer primero en búsquedas." : "Guarda referencias y compártelas con tu artista."}</p>
          <button onClick={() => onNavigate(role === "artist" ? "portfolio" : "favorites")}>
            {role === "artist" ? "Mejorar perfil" : "Ver guardados"} <ChevronRight size={15} />
          </button>
        </div>

        <div className="sidebar-bottom">
          <button className={view === "settings" ? "sidebar-settings active" : "sidebar-settings"} onClick={() => onNavigate("settings")}>
            <Settings size={18} /> Configuración
          </button>
          <div className="account-card">
            <span className="account-avatar">N</span>
            <div><strong>Nikens</strong><span>{role === "artist" ? "Tatuador" : "Cliente"} · Demo</span></div>
            <button className="icon-button" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={onLogout}><LogOut size={17} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({
  role,
  view,
  search,
  onSearch,
  onMenu,
  notificationsOpen,
  onNotifications,
}: {
  role: Role;
  view: View;
  search: string;
  onSearch: (value: string) => void;
  onMenu: () => void;
  notificationsOpen: boolean;
  onNotifications: () => void;
}) {
  const title: Record<View, string> = {
    discover: "Descubrir",
    bookings: role === "artist" ? "Agenda" : "Mis reservas",
    messages: "Mensajes",
    favorites: "Favoritos",
    dashboard: "Panel profesional",
    portfolio: "Portafolio",
    settings: "Configuración",
  };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="icon-button menu-button" aria-label="Abrir menú" onClick={onMenu}><Menu size={22} /></button>
        <div><span>Hola, Nikens</span><h1>{title[view]}</h1></div>
      </div>
      <label className="global-search">
        <Search size={18} />
        <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar artistas, estilos o estudios" />
        <kbd>⌘ K</kbd>
      </label>
      <div className="topbar-actions">
        <div className="notification-wrap">
          <button className={`icon-button notification-button ${notificationsOpen ? "active" : ""}`} aria-label="Notificaciones" onClick={onNotifications}>
            <Bell size={19} /><span />
          </button>
          {notificationsOpen && (
            <div className="notification-popover">
              <div className="popover-heading"><strong>Notificaciones</strong><button>Marcar leídas</button></div>
              <div className="notification-item is-new"><span className="notification-icon"><CalendarDays size={17} /></span><div><strong>Reserva confirmada</strong><p>Matías confirmó tu sesión del viernes.</p><small>Hace 12 min</small></div></div>
              <div className="notification-item is-new"><span className="notification-icon"><MessageCircle size={17} /></span><div><strong>Nuevo mensaje</strong><p>Camila respondió a tu consulta.</p><small>Hace 38 min</small></div></div>
              <div className="notification-item"><span className="notification-icon"><Heart size={17} /></span><div><strong>Tu colección</strong><p>Guardaste 3 nuevas referencias esta semana.</p><small>Ayer</small></div></div>
            </div>
          )}
        </div>
        <button className="profile-chip"><span>N</span><div><strong>Nikens</strong><small>{role === "artist" ? "Modo artista" : "Modo cliente"}</small></div><ChevronDown size={15} /></button>
      </div>
    </header>
  );
}

function SectionHeading({ kicker, title, action }: { kicker?: string; title: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="section-heading">
      <div>{kicker && <span>{kicker}</span>}<h2>{title}</h2></div>
      {action && <button onClick={action.onClick}>{action.label} <ArrowRight size={16} /></button>}
    </div>
  );
}

function ArtistCard({ artist, favorite, onFavorite, onView, onBook }: { artist: Artist; favorite: boolean; onFavorite: () => void; onView: () => void; onBook: () => void }) {
  return (
    <article className="artist-card">
      <div className="artist-cover">
        <img src={artist.cover} alt={`Trabajo de ${artist.name}`} />
        <button className={`favorite-button ${favorite ? "active" : ""}`} aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"} onClick={onFavorite}>
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
        <span className="availability"><span /> Disponible {artist.nextSlot}</span>
      </div>
      <div className="artist-card-body">
        <div className="artist-identity">
          <img src={artist.avatar} alt="" />
          <div>
            <h3>{artist.name} {artist.verified && <BadgeCheck size={17} aria-label="Perfil verificado" />}</h3>
            <p>{artist.studio} · {artist.city}</p>
          </div>
          <span className="rating"><Star size={14} fill="currentColor" /> {artist.rating}</span>
        </div>
        <div className="tag-row">{artist.styles.map((style) => <span key={style}>{style}</span>)}</div>
        <div className="artist-meta">
          <span><MapPin size={14} /> {artist.distance}</span>
          <span>Desde <strong>{formatClp(artist.priceFrom)}</strong></span>
        </div>
        <div className="artist-actions">
          <button className="button button-secondary" onClick={onView}>Ver perfil</button>
          <button className="button button-dark" onClick={onBook}>Reservar</button>
        </div>
      </div>
    </article>
  );
}

function Discover({
  search,
  favorites,
  onFavorite,
  onProfile,
  onBook,
}: {
  search: string;
  favorites: number[];
  onFavorite: (id: number) => void;
  onProfile: (artist: Artist) => void;
  onBook: (artist: Artist) => void;
}) {
  const [style, setStyle] = useState("Todos");
  const [location, setLocation] = useState("Santiago");
  const filtered = useMemo(() => artists.filter((artist) => {
    const matchesSearch = `${artist.name} ${artist.studio} ${artist.city} ${artist.styles.join(" ")}`.toLowerCase().includes(search.toLowerCase());
    const matchesStyle = style === "Todos" || artist.styles.includes(style);
    return matchesSearch && matchesStyle;
  }), [search, style]);

  return (
    <div className="page-stack">
      <section className="discovery-hero">
        <div className="discovery-hero-copy">
          <span className="eyebrow eyebrow-light"><Sparkles size={14} /> Curaduría local</span>
          <h2>Encuentra un artista que entienda <em>tu idea.</em></h2>
          <p>Perfiles verificados, portafolios reales y disponibilidad clara en un solo lugar.</p>
          <div className="hero-search-box">
            <label><MapPin size={18} /><span><small>Ubicación</small><select value={location} onChange={(event) => setLocation(event.target.value)}><option>Santiago</option><option>Providencia</option><option>Ñuñoa</option><option>San Miguel</option></select></span></label>
            <div />
            <label><Palette size={18} /><span><small>Estilo</small><select value={style} onChange={(event) => setStyle(event.target.value)}>{styleOptions.map((item) => <option key={item}>{item}</option>)}</select></span></label>
            <button aria-label="Buscar"><Search size={20} /></button>
          </div>
        </div>
        <div className="discovery-art">
          <div className="art-number"><strong>4,9</strong><span>promedio de artistas verificados</span></div>
          <div className="art-ink ink-one" />
          <div className="art-ink ink-two" />
          <span className="art-word">TINTA</span>
        </div>
      </section>

      <section>
        <SectionHeading kicker={`${filtered.length} perfiles disponibles`} title="Artistas recomendados para ti" action={{ label: "Ver todos", onClick: () => setStyle("Todos") }} />
        {filtered.length > 0 ? (
          <div className="artist-grid">
            {filtered.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} favorite={favorites.includes(artist.id)} onFavorite={() => onFavorite(artist.id)} onView={() => onProfile(artist)} onBook={() => onBook(artist)} />
            ))}
          </div>
        ) : (
          <div className="empty-state"><Search size={28} /><h3>No encontramos coincidencias</h3><p>Prueba con otro nombre, estilo o estudio.</p></div>
        )}
      </section>

      <section className="inspiration-section">
        <SectionHeading kicker="Inspiración" title="Ideas que están marcando tendencia" />
        <div className="inspiration-grid">
          {portfolioSeed.slice(0, 5).map((item, index) => (
            <article key={item.id} className={`inspiration-card inspiration-${index + 1}`}>
              <img src={item.image} alt={item.title} />
              <div><span>{item.style}</span><h3>{item.title}</h3><p><Heart size={14} /> {item.likes} guardados</p></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Bookings({ bookings, role, onExplore, onMessage }: { bookings: Booking[]; role: Role; onExplore: () => void; onMessage: () => void }) {
  const upcoming = bookings.filter((booking) => booking.status !== "Completada");
  const past = bookings.filter((booking) => booking.status === "Completada");

  return (
    <div className="page-stack">
      <section className="bookings-summary">
        <div><span>Próxima sesión</span><h2>{upcoming[0]?.date ?? "Sin reservas próximas"}</h2><p>{upcoming[0] ? `${upcoming[0].time} · ${upcoming[0].studio}` : "Explora artistas y agenda cuando quieras."}</p></div>
        {upcoming[0] && <div className="countdown"><span>Faltan</span><strong>5</strong><small>días</small></div>}
        <button className="button button-light" onClick={upcoming[0] ? onMessage : onExplore}>{upcoming[0] ? "Hablar con el artista" : "Explorar artistas"}</button>
      </section>

      <section>
        <SectionHeading kicker={role === "artist" ? "Agenda de julio" : "Próximas"} title={role === "artist" ? "Sesiones programadas" : "Tus reservas"} />
        <div className="booking-list">
          {upcoming.map((booking) => (
            <article key={booking.id} className="booking-row">
              <div className="booking-date"><strong>{booking.date.split(" ")[0]}</strong><span>{booking.date.split(" ")[1]}</span></div>
              <div className="booking-main"><span className={`status status-${booking.status === "Confirmada" ? "confirmed" : "pending"}`}><i />{booking.status}</span><h3>{role === "artist" ? `Nikens · ${booking.style}` : booking.artist}</h3><p>{booking.style} · {booking.time} · {booking.studio}</p></div>
              <div className="booking-price"><span>Valor estimado</span><strong>{formatClp(booking.price)}</strong></div>
              <button className="icon-button"><MoreHorizontal size={19} /></button>
            </article>
          ))}
          {upcoming.length === 0 && <div className="empty-state"><CalendarDays size={28} /><h3>Tu agenda está libre</h3><p>Cuando reserves una sesión aparecerá aquí.</p><button className="button button-primary" onClick={onExplore}>Buscar artistas</button></div>}
        </div>
      </section>

      {past.length > 0 && (
        <section>
          <SectionHeading kicker="Historial" title="Sesiones anteriores" />
          <div className="past-bookings">
            {past.map((booking) => <article key={booking.id}><span className="past-icon"><Check size={18} /></span><div><strong>{booking.artist}</strong><p>{booking.style} · {booking.date}</p></div><button>Ver cuidados <ExternalLink size={14} /></button></article>)}
          </div>
        </section>
      )}
    </div>
  );
}

function Messages({ conversations, setConversations }: { conversations: Conversation[]; setConversations: (items: Conversation[]) => void }) {
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? 1);
  const [draft, setDraft] = useState("");
  const active = conversations.find((item) => item.id === activeId) ?? conversations[0];
  const threadEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { threadEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.messages.length]);

  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !active) return;
    setConversations(conversations.map((item) => item.id === active.id ? { ...item, messages: [...item.messages, { id: Date.now(), from: "me", text, time: "Ahora" }] } : item));
    setDraft("");
  };

  if (!active) return null;

  return (
    <section className="messages-layout">
      <aside className="conversation-list">
        <div className="conversation-list-head"><div><span>Bandeja</span><strong>{conversations.length} conversaciones</strong></div><button className="icon-button"><Plus size={18} /></button></div>
        <label className="conversation-search"><Search size={16} /><input placeholder="Buscar conversación" /></label>
        <div>
          {conversations.map((conversation) => {
            const last = conversation.messages.at(-1);
            return (
              <button key={conversation.id} className={activeId === conversation.id ? "active" : ""} onClick={() => { setActiveId(conversation.id); setConversations(conversations.map((item) => item.id === conversation.id ? { ...item, unread: 0 } : item)); }}>
                <span className="conversation-avatar"><img src={conversation.avatar} alt="" /><i /></span>
                <span className="conversation-preview"><strong>{conversation.person}</strong><small>{last?.text}</small></span>
                <span className="conversation-time">{last?.time}{conversation.unread > 0 && <b>{conversation.unread}</b>}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="message-panel">
        <header className="message-head"><div className="message-person"><img src={active.avatar} alt="" /><div><strong>{active.person}</strong><span><i /> En línea · {active.role}</span></div></div><div><button className="button button-secondary button-small"><CalendarDays size={15} /> Ver reserva</button><button className="icon-button"><Ellipsis size={19} /></button></div></header>
        <div className="message-context"><ShieldCheck size={16} /><span>Conversación protegida por Tinta. No compartas datos bancarios por mensaje.</span></div>
        <div className="message-thread">
          <span className="thread-date">Hoy</span>
          {active.messages.map((message) => <div key={message.id} className={`message-bubble ${message.from === "me" ? "mine" : "theirs"}`}><p>{message.text}</p><span>{message.time}</span></div>)}
          <div ref={threadEnd} />
        </div>
        <form className="message-composer" onSubmit={send}><button type="button" className="icon-button"><Plus size={19} /></button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escribe un mensaje…" aria-label="Mensaje" /><button className="send-button" aria-label="Enviar mensaje"><Send size={18} /></button></form>
      </div>
    </section>
  );
}

function Favorites({ favorites, onProfile, onBook, onRemove, onExplore }: { favorites: number[]; onProfile: (artist: Artist) => void; onBook: (artist: Artist) => void; onRemove: (id: number) => void; onExplore: () => void }) {
  const items = artists.filter((artist) => favorites.includes(artist.id));
  return (
    <div className="page-stack">
      <section className="simple-hero"><div><span className="eyebrow"><Heart size={14} /> Tu selección</span><h2>Artistas que te inspiraron</h2><p>Compara sus estilos y vuelve a ellos cuando tu idea esté lista.</p></div><strong>{items.length}<span>guardados</span></strong></section>
      {items.length > 0 ? <div className="artist-grid">{items.map((artist) => <ArtistCard key={artist.id} artist={artist} favorite onFavorite={() => onRemove(artist.id)} onView={() => onProfile(artist)} onBook={() => onBook(artist)} />)}</div> : <div className="empty-state large"><Heart size={32} /><h3>Aún no guardas artistas</h3><p>Cuando encuentres un estilo que te guste, toca el corazón para conservarlo.</p><button className="button button-primary" onClick={onExplore}>Explorar artistas</button></div>}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, delta, tone }: { icon: typeof Users; label: string; value: string; delta: string; tone: string }) {
  return <article className={`metric-card tone-${tone}`}><span><Icon size={19} /></span><div><p>{label}</p><h3>{value}</h3><small><TrendingUp size={13} /> {delta}</small></div></article>;
}

function Dashboard({ requests, onRequest, onPortfolio, onAgenda }: { requests: typeof initialRequests; onRequest: (id: number, action: string) => void; onPortfolio: () => void; onAgenda: () => void }) {
  return (
    <div className="page-stack">
      <section className="dashboard-welcome"><div><span className="eyebrow eyebrow-light"><Sparkles size={14} /> Resumen de hoy</span><h2>Tu estudio está en movimiento.</h2><p>Tienes 2 solicitudes nuevas y una sesión confirmada para esta tarde.</p></div><button className="button button-light" onClick={onPortfolio}><Plus size={17} /> Publicar trabajo</button></section>
      <section className="metrics-grid">
        <MetricCard icon={Inbox} label="Solicitudes nuevas" value="12" delta="18% este mes" tone="orange" />
        <MetricCard icon={CalendarDays} label="Sesiones confirmadas" value="18" delta="4 esta semana" tone="purple" />
        <MetricCard icon={CircleDollarSign} label="Ingresos de julio" value="$1.840.000" delta="12% vs. junio" tone="green" />
        <MetricCard icon={Users} label="Visitas al perfil" value="2.408" delta="31% este mes" tone="blue" />
      </section>
      <div className="dashboard-grid">
        <section className="panel-card requests-panel">
          <div className="panel-heading"><div><span>Solicitudes</span><h3>Nuevos proyectos</h3></div><button>Ver todas <ArrowRight size={15} /></button></div>
          <div className="request-list">
            {requests.map((request) => (
              <article key={request.id}>
                <span className="request-avatar">{request.initials}</span>
                <div className="request-copy"><div><strong>{request.client}</strong><span>{request.received}</span></div><h4>{request.concept}</h4><p>{request.placement} · {request.budget}</p></div>
                <div className="request-actions"><button className="icon-button reject" aria-label="Rechazar" onClick={() => onRequest(request.id, "rechazada")}><X size={17} /></button><button className="icon-button accept" aria-label="Aceptar" onClick={() => onRequest(request.id, "aceptada")}><Check size={17} /></button></div>
              </article>
            ))}
          </div>
        </section>
        <section className="panel-card schedule-panel">
          <div className="panel-heading"><div><span>Hoy · 14 de julio</span><h3>Próximas sesiones</h3></div><button onClick={onAgenda}>Agenda <ArrowRight size={15} /></button></div>
          <div className="schedule-list">
            <article><time>11:00</time><i className="schedule-line" /><div><span className="status status-confirmed"><i />Confirmada</span><h4>Flor botánica · Javiera P.</h4><p>Fine line · Antebrazo · 2 h</p></div></article>
            <article><time>15:30</time><i className="schedule-line purple" /><div><span className="status status-pending"><i />Consulta</span><h4>Geometría · Tomás R.</h4><p>Videollamada · 30 min</p></div></article>
            <article><time>18:00</time><i className="schedule-line muted" /><div><span className="status status-draft"><i />Boceto</span><h4>Revisión de diseño · Belén M.</h4><p>Preparación interna · 45 min</p></div></article>
          </div>
        </section>
      </div>
      <section className="panel-card activity-chart">
        <div className="panel-heading"><div><span>Rendimiento</span><h3>Interés en tu perfil</h3></div><select aria-label="Periodo"><option>Últimos 30 días</option><option>Últimos 90 días</option></select></div>
        <div className="chart-wrap"><div className="chart-labels"><span>600</span><span>450</span><span>300</span><span>150</span><span>0</span></div><div className="chart-bars">{[38, 54, 43, 66, 58, 82, 76, 91, 74, 88, 100, 92].map((height, index) => <div key={index}><span style={{ height: `${height}%` }} /><small>{index % 2 === 0 ? `${index + 1} Jul` : ""}</small></div>)}</div></div>
      </section>
    </div>
  );
}

function Portfolio({ items, onAdd }: { items: typeof portfolioSeed; onAdd: () => void }) {
  return (
    <div className="page-stack">
      <section className="profile-banner">
        <div className="profile-banner-art"><span>INK</span></div>
        <div className="profile-summary"><span className="profile-large-avatar">N</span><div><div className="profile-name"><h2>Nikens Ink</h2><BadgeCheck size={20} /></div><p>@nikens.ink · Santiago, Chile</p><div className="tag-row"><span>Fine line</span><span>Blackwork</span><span>Botánico</span></div></div><button className="button button-secondary"><Settings size={16} /> Editar perfil</button><button className="button button-primary" onClick={onAdd}><Upload size={16} /> Nuevo trabajo</button></div>
        <div className="profile-stats"><span><strong>{items.length}</strong> trabajos</span><span><strong>4,9</strong> valoración</span><span><strong>1.284</strong> seguidores</span><span><strong>96%</strong> respuestas</span></div>
      </section>
      <section><SectionHeading kicker="Portafolio público" title="Tus trabajos" action={{ label: "Agregar trabajo", onClick: onAdd }} /><div className="portfolio-grid">{items.map((item) => <article key={item.id}><img src={item.image} alt={item.title} /><div><span>{item.style}</span><h3>{item.title}</h3><p><Heart size={14} fill="currentColor" /> {item.likes}</p></div></article>)}</div></section>
    </div>
  );
}

function SettingsPage({ role, onRole, onToast }: { role: Role; onRole: (role: Role) => void; onToast: (text: string) => void }) {
  const [radius, setRadius] = useState(25);
  const submit = (event: FormEvent) => { event.preventDefault(); onToast("Configuración guardada"); };
  return (
    <div className="settings-layout">
      <aside><button className="active"><UserRound size={17} /> Perfil</button><button><Bell size={17} /> Notificaciones</button><button><ShieldCheck size={17} /> Privacidad y seguridad</button><button><WalletCards size={17} /> Pagos</button></aside>
      <form className="settings-form" onSubmit={submit}>
        <div className="settings-heading"><span>Perfil y preferencias</span><h2>Personaliza tu experiencia</h2><p>Estos datos se usan para recomendar artistas y organizar tu cuenta.</p></div>
        <div className="settings-section"><h3>Información personal</h3><div className="form-grid"><label><span>Nombre visible</span><input defaultValue="Nikens" /></label><label><span>Correo</span><input type="email" defaultValue="nikens@correo.com" /></label><label><span>Ciudad</span><select defaultValue="Santiago"><option>Santiago</option><option>Providencia</option><option>Ñuñoa</option></select></label><label><span>Idioma</span><select defaultValue="Español (Chile)"><option>Español (Chile)</option><option>English</option><option>Français</option></select></label></div></div>
        <div className="settings-section"><h3>Tipo de cuenta</h3><div className="account-choice"><button type="button" className={role === "client" ? "active" : ""} onClick={() => onRole("client")}><UserRound size={20} /><span><strong>Cliente</strong><small>Descubrir, guardar y reservar</small></span>{role === "client" && <Check size={18} />}</button><button type="button" className={role === "artist" ? "active" : ""} onClick={() => onRole("artist")}><Palette size={20} /><span><strong>Artista</strong><small>Agenda, solicitudes y portafolio</small></span>{role === "artist" && <Check size={18} />}</button></div></div>
        <div className="settings-section"><h3>Descubrimiento</h3><label className="range-field"><span><strong>Radio de búsqueda</strong><small>Mostraremos artistas dentro de esta distancia.</small></span><b>{radius} km</b><input type="range" min="5" max="100" value={radius} onChange={(event) => setRadius(Number(event.target.value))} /></label><label className="toggle-field"><span><strong>Solo perfiles verificados</strong><small>Prioriza artistas con identidad y estudio validados.</small></span><input type="checkbox" defaultChecked /></label><label className="toggle-field"><span><strong>Resumen semanal</strong><small>Recibe nuevas recomendaciones y disponibilidad.</small></span><input type="checkbox" defaultChecked /></label></div>
        <div className="settings-save"><button type="button" className="button button-secondary">Cancelar</button><button className="button button-primary">Guardar cambios</button></div>
      </form>
    </div>
  );
}

function ArtistModal({ artist, favorite, onClose, onFavorite, onBook }: { artist: Artist; favorite: boolean; onClose: () => void; onFavorite: () => void; onBook: () => void }) {
  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-label={`Perfil de ${artist.name}`}>
      <button className="modal-scrim" aria-label="Cerrar" onClick={onClose} />
      <div className="modal-card artist-modal">
        <div className="artist-modal-cover"><img src={artist.cover} alt={`Portafolio de ${artist.name}`} /><button className="modal-close" onClick={onClose}><X size={20} /></button></div>
        <div className="artist-modal-content">
          <div className="artist-modal-head"><img src={artist.avatar} alt="" /><div><h2>{artist.name} <BadgeCheck size={19} /></h2><p>{artist.handle} · {artist.studio}</p></div><span className="rating"><Star size={14} fill="currentColor" /> {artist.rating} ({artist.reviews})</span></div>
          <p className="artist-bio">{artist.bio}</p>
          <div className="artist-facts"><span><MapPin size={16} /><strong>{artist.city}</strong><small>{artist.distance} de ti</small></span><span><CalendarDays size={16} /><strong>{artist.nextSlot}</strong><small>próxima hora</small></span><span><CircleDollarSign size={16} /><strong>{formatClp(artist.priceFrom)}</strong><small>precio inicial</small></span></div>
          <div className="modal-portfolio">{artist.work.map((image, index) => <img key={image} src={image} alt={`Trabajo ${index + 1} de ${artist.name}`} />)}</div>
          <div className="artist-modal-actions"><button className={`button button-secondary ${favorite ? "is-favorite" : ""}`} onClick={onFavorite}><Heart size={17} fill={favorite ? "currentColor" : "none"} />{favorite ? "Guardado" : "Guardar"}</button><button className="button button-primary" onClick={onBook}>Solicitar reserva <ArrowRight size={17} /></button></div>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ artist, onClose, onConfirm }: { artist: Artist; onClose: () => void; onConfirm: (booking: Booking) => void }) {
  const [style, setStyle] = useState(artist.styles[0]);
  const [placement, setPlacement] = useState("Antebrazo");
  const [size, setSize] = useState("Mediano");
  const [date, setDate] = useState("2026-07-23");
  const [time, setTime] = useState(times[2]);
  const [notes, setNotes] = useState("");
  const price = artist.priceFrom + (size === "Grande" ? 70000 : size === "Mediano" ? 30000 : 0);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    onConfirm({ id: Date.now(), artistId: artist.id, artist: artist.name, studio: artist.studio, style: `${style} · ${placement}`, date: new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)).replace(".", ""), time, status: "En revisión", price });
  };
  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Solicitar reserva">
      <button className="modal-scrim" aria-label="Cerrar" onClick={onClose} />
      <form className="modal-card booking-modal" onSubmit={submit}>
        <header><div><span className="eyebrow"><CalendarDays size={14} /> Solicitud de reserva</span><h2>Cuéntale tu idea a {artist.name.split(" ")[0]}</h2><p>La solicitud no genera cobros. El artista confirmará disponibilidad y valor final.</p></div><button type="button" className="modal-close static" onClick={onClose}><X size={20} /></button></header>
        <div className="booking-artist-mini"><img src={artist.avatar} alt="" /><div><strong>{artist.name}</strong><span>{artist.studio} · {artist.city}</span></div><span className="rating"><Star size={14} fill="currentColor" /> {artist.rating}</span></div>
        <div className="booking-form-grid"><label><span>Estilo</span><select value={style} onChange={(event) => setStyle(event.target.value)}>{artist.styles.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Zona del cuerpo</span><select value={placement} onChange={(event) => setPlacement(event.target.value)}><option>Antebrazo</option><option>Brazo</option><option>Pantorrilla</option><option>Espalda</option><option>Otro</option></select></label><label><span>Tamaño aproximado</span><select value={size} onChange={(event) => setSize(event.target.value)}><option>Pequeño</option><option>Mediano</option><option>Grande</option></select></label><label><span>Fecha preferida</span><input type="date" min="2026-07-15" value={date} onChange={(event) => setDate(event.target.value)} required /></label></div>
        <fieldset className="time-picker"><legend>Horario preferido</legend><div>{times.map((item) => <button type="button" className={time === item ? "active" : ""} key={item} onClick={() => setTime(item)}>{item}</button>)}</div></fieldset>
        <label className="notes-field"><span>Describe tu idea <small>opcional</small></span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Concepto, referencias, colores y cualquier detalle que ayude al artista…" maxLength={400} /><small>{notes.length}/400</small></label>
        <div className="booking-total"><span><small>Valor estimado</small><strong>{formatClp(price)}</strong></span><p><ShieldCheck size={15} /> El monto final se acuerda antes de confirmar.</p></div>
        <footer><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button className="button button-primary">Enviar solicitud <ArrowRight size={17} /></button></footer>
      </form>
    </div>
  );
}

function UploadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: typeof portfolioSeed[number]) => void }) {
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("Fine line");
  const [image, setImage] = useState<string>(artists[0].work[0]);
  const submit = (event: FormEvent) => { event.preventDefault(); if (!title.trim()) return; onAdd({ id: Date.now(), title, style, image, likes: 0 }); };
  return <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Publicar trabajo"><button className="modal-scrim" aria-label="Cerrar" onClick={onClose} /><form className="modal-card upload-modal" onSubmit={submit}><header><div><span className="eyebrow"><ImagePlus size={14} /> Portafolio</span><h2>Publicar un nuevo trabajo</h2><p>Una buena descripción ayuda a que te encuentren por estilo.</p></div><button type="button" className="modal-close static" onClick={onClose}><X size={20} /></button></header><label className="upload-drop"><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) setImage(URL.createObjectURL(file)); }} /><img src={image} alt="Vista previa" /><span><Upload size={18} /> Cambiar fotografía</span></label><div className="booking-form-grid"><label><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Botánica en movimiento" required /></label><label><span>Estilo</span><select value={style} onChange={(event) => setStyle(event.target.value)}>{styleOptions.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label></div><footer><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button className="button button-primary">Publicar trabajo</button></footer></form></div>;
}

function Toast({ text }: { text: string }) { return <div className="toast"><span><Check size={16} /></span>{text}</div>; }

export default function TintaApp() {
  const [entered, setEntered] = useState(false);
  const [role, setRole] = useState<Role>("client");
  const [view, setView] = useState<View>("discover");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 3]);
  const [bookings, setBookings] = useState<Booking[]>(seededBookings);
  const [conversations, setConversations] = useState<Conversation[]>(seededConversations);
  const [requests, setRequests] = useState(initialRequests);
  const [portfolio, setPortfolio] = useState(portfolioSeed);
  const [profileArtist, setProfileArtist] = useState<Artist | null>(null);
  const [bookingArtist, setBookingArtist] = useState<Artist | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const hydrated = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem("tinta-demo-state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.favorites)) setFavorites(parsed.favorites);
          if (Array.isArray(parsed.bookings)) setBookings(parsed.bookings);
          if (parsed.role === "client" || parsed.role === "artist") setRole(parsed.role);
        }
      } catch { /* Demo state can safely reset. */ }
      hydrated.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem("tinta-demo-state", JSON.stringify({ favorites, bookings, role }));
  }, [favorites, bookings, role]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const enter = (nextRole: Role) => {
    setRole(nextRole);
    setView(nextRole === "artist" ? "dashboard" : "discover");
    setEntered(true);
  };

  const changeRole = (nextRole: Role) => {
    setRole(nextRole);
    setView(nextRole === "artist" ? "dashboard" : "discover");
    setToast(nextRole === "artist" ? "Cambiaste al modo artista" : "Cambiaste al modo cliente");
  };

  const toggleFavorite = (id: number) => {
    const removing = favorites.includes(id);
    setFavorites(removing ? favorites.filter((item) => item !== id) : [...favorites, id]);
    setToast(removing ? "Quitado de favoritos" : "Artista guardado en favoritos");
  };

  const confirmBooking = (booking: Booking) => {
    setBookings([booking, ...bookings]);
    setBookingArtist(null);
    setProfileArtist(null);
    setView("bookings");
    setToast("Solicitud enviada al artista");
  };

  const handleRequest = (id: number, action: string) => {
    setRequests(requests.filter((request) => request.id !== id));
    setToast(`Solicitud ${action}`);
  };

  if (!entered) return <Welcome onEnter={enter} />;

  return (
    <div className="app-shell">
      <Sidebar role={role} view={view} favoritesCount={favorites.length} onNavigate={setView} onRoleChange={changeRole} onLogout={() => setEntered(false)} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-main">
        <Topbar role={role} view={view} search={search} onSearch={setSearch} onMenu={() => setMobileOpen(true)} notificationsOpen={notificationsOpen} onNotifications={() => setNotificationsOpen(!notificationsOpen)} />
        <main className="page-content" onClick={() => notificationsOpen && setNotificationsOpen(false)}>
          {view === "discover" && <Discover search={search} favorites={favorites} onFavorite={toggleFavorite} onProfile={setProfileArtist} onBook={setBookingArtist} />}
          {view === "bookings" && <Bookings bookings={bookings} role={role} onExplore={() => setView("discover")} onMessage={() => setView("messages")} />}
          {view === "messages" && <Messages conversations={conversations} setConversations={setConversations} />}
          {view === "favorites" && <Favorites favorites={favorites} onProfile={setProfileArtist} onBook={setBookingArtist} onRemove={toggleFavorite} onExplore={() => setView("discover")} />}
          {view === "dashboard" && <Dashboard requests={requests} onRequest={handleRequest} onPortfolio={() => setView("portfolio")} onAgenda={() => setView("bookings")} />}
          {view === "portfolio" && <Portfolio items={portfolio} onAdd={() => setUploadOpen(true)} />}
          {view === "settings" && <SettingsPage role={role} onRole={changeRole} onToast={setToast} />}
        </main>
      </div>
      {profileArtist && <ArtistModal artist={profileArtist} favorite={favorites.includes(profileArtist.id)} onClose={() => setProfileArtist(null)} onFavorite={() => toggleFavorite(profileArtist.id)} onBook={() => { setBookingArtist(profileArtist); setProfileArtist(null); }} />}
      {bookingArtist && <BookingModal artist={bookingArtist} onClose={() => setBookingArtist(null)} onConfirm={confirmBooking} />}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onAdd={(item) => { setPortfolio([item, ...portfolio]); setUploadOpen(false); setToast("Trabajo publicado en tu portafolio"); }} />}
      {toast && <Toast text={toast} />}
    </div>
  );
}
