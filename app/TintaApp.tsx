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
  Heart,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
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
import { FormEvent, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  Artist,
  Booking,
  Conversation,
  PortfolioItem,
  artists,
  formatClp,
  portfolioSeed,
} from "./data";

type Role = "client" | "artist";
type View = "discover" | "bookings" | "messages" | "favorites" | "dashboard" | "portfolio" | "settings";

const styleOptions = ["Todos", "Fine line", "Blackwork", "Realismo", "Neo tradicional", "Botánico", "Geométrico", "Color", "Black & grey", "Minimalista"];
const times = ["10:00", "11:30", "14:00", "15:30", "17:00"];

function displayBookingDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("es-CL", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`)).replace(".", "");
}

function daysUntil(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const target = new Date(`${value}T00:00:00Z`).valueOf();
  const today = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`).valueOf();
  return Math.max(0, Math.ceil((target - today) / 86_400_000));
}

const clientNav = [
  { id: "discover" as View, label: "Descubrir", icon: Compass },
  { id: "bookings" as View, label: "Mis reservas", icon: CalendarDays },
  { id: "messages" as View, label: "Mensajes", icon: MessageCircle },
  { id: "favorites" as View, label: "Favoritos", icon: Heart },
];

const artistNav = [
  { id: "dashboard" as View, label: "Panel", icon: LayoutDashboard },
  { id: "bookings" as View, label: "Agenda", icon: CalendarDays },
  { id: "messages" as View, label: "Mensajes", icon: MessageCircle },
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

function ArtistAvatar({ artist, className = "" }: { artist: Artist; className?: string }) {
  return artist.avatar
    ? <img className={className} src={artist.avatar} alt="" />
    : <span className={`artist-initial ${className}`} aria-hidden="true">{artist.name.charAt(0).toUpperCase()}</span>;
}

function Sidebar({
  role,
  view,
  favoritesCount,
  messagesCount,
  onNavigate,
  onRoleChange,
  mobileOpen,
  onClose,
  userName,
  userEmail,
}: {
  role: Role;
  view: View;
  favoritesCount: number;
  messagesCount: number;
  onNavigate: (view: View) => void;
  onRoleChange: (role: Role) => void;
  mobileOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
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
                {item.id === "messages" && messagesCount > 0 && <b>{messagesCount}</b>}
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
            <span className="account-avatar">{userName.charAt(0).toUpperCase()}</span>
            <div><strong>{userName}</strong><span>{role === "artist" ? "Tatuador" : "Cliente"} · {userEmail}</span></div>
            <a className="icon-button" aria-label="Cerrar sesión" title="Cerrar sesión" href="/signout-with-chatgpt?return_to=%2F"><LogOut size={17} /></a>
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
  userName,
  notifications,
  onSettings,
  searchRef,
}: {
  role: Role;
  view: View;
  search: string;
  onSearch: (value: string) => void;
  onMenu: () => void;
  notificationsOpen: boolean;
  onNotifications: () => void;
  userName: string;
  notifications: Array<{ id: string; title: string; text: string }>;
  onSettings: () => void;
  searchRef: RefObject<HTMLInputElement | null>;
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
        <div><span>Hola, {userName.split(" ")[0]}</span><h1>{title[view]}</h1></div>
      </div>
      {view === "discover" && <label className="global-search">
        <Search size={18} />
        <input ref={searchRef} value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar artistas, estilos o estudios" />
        <kbd>⌘ K</kbd>
      </label>}
      <div className="topbar-actions">
        <div className="notification-wrap">
          <button className={`icon-button notification-button ${notificationsOpen ? "active" : ""}`} aria-label="Notificaciones" onClick={onNotifications}>
            <Bell size={19} />{notifications.length > 0 && <span />}
          </button>
          {notificationsOpen && (
            <div className="notification-popover">
              <div className="popover-heading"><strong>Actividad reciente</strong><button onClick={onNotifications}>Cerrar</button></div>
              {notifications.map((item) => <div className="notification-item is-new" key={item.id}><span className="notification-icon"><CalendarDays size={17} /></span><div><strong>{item.title}</strong><p>{item.text}</p></div></div>)}
              {notifications.length === 0 && <div className="notification-empty"><Bell size={20} /><span>No tienes novedades pendientes.</span></div>}
            </div>
          )}
        </div>
        <button className="profile-chip" onClick={onSettings}><span>{userName.charAt(0).toUpperCase()}</span><div><strong>{userName}</strong><small>{role === "artist" ? "Modo artista" : "Modo cliente"}</small></div><ChevronDown size={15} /></button>
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
        {artist.cover ? <img src={artist.cover} alt={`Trabajo de ${artist.name}`} /> : <div className="artist-cover-placeholder"><Palette size={30} /><span>Portafolio en preparación</span></div>}
        <button className={`favorite-button ${favorite ? "active" : ""}`} aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"} onClick={onFavorite}>
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
        <span className="availability"><span /> Acepta solicitudes</span>
      </div>
      <div className="artist-card-body">
        <div className="artist-identity">
          <ArtistAvatar artist={artist} />
          <div>
            <h3>{artist.name} {artist.verified && <BadgeCheck size={17} aria-label="Perfil verificado" />}</h3>
            <p>{artist.studio} · {artist.city}</p>
          </div>
          {artist.reviews > 0 && <span className="rating"><Star size={14} fill="currentColor" /> {artist.rating}</span>}
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
  artistList,
  onFavorite,
  onProfile,
  onBook,
}: {
  search: string;
  favorites: string[];
  artistList: Artist[];
  onFavorite: (id: string) => void;
  onProfile: (artist: Artist) => void;
  onBook: (artist: Artist) => void;
}) {
  const [style, setStyle] = useState("Todos");
  const [location, setLocation] = useState("Todas las comunas");
  const filtered = useMemo(() => artistList.filter((artist) => {
    const matchesSearch = `${artist.name} ${artist.studio} ${artist.city} ${artist.styles.join(" ")}`.toLowerCase().includes(search.toLowerCase());
    const matchesStyle = style === "Todos" || artist.styles.includes(style);
    const matchesLocation = location === "Todas las comunas" || artist.city === location;
    return matchesSearch && matchesStyle && matchesLocation;
  }), [artistList, location, search, style]);

  return (
    <div className="page-stack">
      <section className="discovery-hero">
        <div className="discovery-hero-copy">
          <span className="eyebrow eyebrow-light"><Sparkles size={14} /> Curaduría local</span>
          <h2>Encuentra un artista que entienda <em>tu idea.</em></h2>
          <p>Perfiles verificados, portafolios reales y disponibilidad clara en un solo lugar.</p>
          <div className="hero-search-box">
            <label><MapPin size={18} /><span><small>Ubicación</small><select value={location} onChange={(event) => setLocation(event.target.value)}><option>Todas las comunas</option><option>Santiago</option><option>Santiago Centro</option><option>Providencia</option><option>Ñuñoa</option><option>San Miguel</option></select></span></label>
            <div />
            <label><Palette size={18} /><span><small>Estilo</small><select value={style} onChange={(event) => setStyle(event.target.value)}>{styleOptions.map((item) => <option key={item}>{item}</option>)}</select></span></label>
            <button type="button" className="hero-search-action" aria-label="Ver resultados" onClick={() => document.getElementById("artist-results")?.scrollIntoView({ behavior: "smooth" })}><Search size={20} /></button>
          </div>
        </div>
        <div className="discovery-art">
          <div className="art-number"><strong>20%</strong><span>anticipo calculado para cada reserva</span></div>
          <div className="art-ink ink-one" />
          <div className="art-ink ink-two" />
          <span className="art-word">TINTA</span>
        </div>
      </section>

      <section id="artist-results">
        <SectionHeading kicker={`${filtered.length} ${filtered.length === 1 ? "perfil disponible" : "perfiles disponibles"}`} title="Artistas recomendados para ti" action={{ label: "Limpiar filtros", onClick: () => { setStyle("Todos"); setLocation("Todas las comunas"); } }} />
        {filtered.length > 0 ? (
          <div className="artist-grid">
            {filtered.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} favorite={favorites.includes(artist.id)} onFavorite={() => onFavorite(artist.id)} onView={() => onProfile(artist)} onBook={() => onBook(artist)} />
            ))}
          </div>
        ) : (
          <div className="empty-state"><Search size={28} /><h3>{artistList.length ? "No encontramos coincidencias" : "Aún no hay artistas publicados"}</h3><p>{artistList.length ? "Prueba con otra comuna, nombre o estilo." : "Los perfiles profesionales aparecerán aquí cuando publiquen su portafolio."}</p></div>
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

function Bookings({ bookings, role, onExplore, onMessage, onPay, payingId, paymentsConfigured }: { bookings: Booking[]; role: Role; onExplore: () => void; onMessage: () => void; onPay: (booking: Booking) => void; payingId: string | null; paymentsConfigured: boolean }) {
  const visibleBookings = bookings.filter((booking) => role === "artist" ? booking.perspective === "artist" : booking.perspective !== "artist");
  const upcoming = visibleBookings.filter((booking) => !["Completada", "Rechazada", "Reembolsada"].includes(booking.status));
  const past = visibleBookings.filter((booking) => ["Completada", "Rechazada", "Reembolsada"].includes(booking.status));
  const countdown = upcoming[0] ? daysUntil(upcoming[0].date) : null;

  return (
    <div className="page-stack">
      <section className="bookings-summary">
        <div><span>Próxima sesión</span><h2>{upcoming[0] ? displayBookingDate(upcoming[0].date) : "Sin reservas próximas"}</h2><p>{upcoming[0] ? `${upcoming[0].time} · ${upcoming[0].studio}` : "Explora artistas y agenda cuando quieras."}</p></div>
        {upcoming[0] && countdown !== null && <div className="countdown"><span>Faltan</span><strong>{countdown}</strong><small>{countdown === 1 ? "día" : "días"}</small></div>}
        <button className="button button-light" onClick={upcoming[0] ? onMessage : onExplore}>{upcoming[0] ? "Hablar con el artista" : "Explorar artistas"}</button>
      </section>

      <section>
        <SectionHeading kicker={role === "artist" ? "Agenda de julio" : "Próximas"} title={role === "artist" ? "Sesiones programadas" : "Tus reservas"} />
        <div className="booking-list">
          {upcoming.map((booking) => (
            <article key={booking.id} className="booking-row">
              <div className="booking-date"><strong>{displayBookingDate(booking.date).split(" ")[0]}</strong><span>{displayBookingDate(booking.date).split(" ")[1]}</span></div>
              <div className="booking-main"><span className={`status status-${booking.status === "Confirmada" ? "confirmed" : "pending"}`}><i />{booking.status}</span><h3>{role === "artist" ? `${booking.client || "Cliente"} · ${booking.style}` : booking.artist}</h3><p>{booking.style} · {booking.time} · {booking.studio}</p></div>
              <div className="booking-price"><span>Valor estimado</span><strong>{formatClp(booking.price)}</strong>{booking.paymentStatus === "approved" && <small className="payment-approved"><ShieldCheck size={13} /> Anticipo pagado</small>}</div>
              {role === "client" && booking.paymentStatus !== "approved" && booking.status === "Esperando anticipo" ? (
                <button className="button button-primary booking-pay" disabled={payingId === booking.id || !paymentsConfigured} title={!paymentsConfigured ? "Falta configurar Mercado Pago" : undefined} onClick={() => onPay(booking)}>
                  {payingId === booking.id ? "Preparando…" : paymentsConfigured ? `Pagar ${formatClp(booking.depositAmount ?? 0)}` : "Pago pendiente"}
                </button>
              ) : <span className="booking-state-note">{booking.paymentStatus === "approved" ? "Pago verificado" : "Sin acciones pendientes"}</span>}
            </article>
          ))}
          {upcoming.length === 0 && <div className="empty-state"><CalendarDays size={28} /><h3>Tu agenda está libre</h3><p>Cuando reserves una sesión aparecerá aquí.</p><button className="button button-primary" onClick={onExplore}>Buscar artistas</button></div>}
        </div>
      </section>

      {past.length > 0 && (
        <section>
          <SectionHeading kicker="Historial" title="Sesiones anteriores" />
          <div className="past-bookings">
            {past.map((booking) => <article key={booking.id}><span className="past-icon"><Check size={18} /></span><div><strong>{booking.artist}</strong><p>{booking.style} · {displayBookingDate(booking.date)} · {booking.status}</p></div></article>)}
          </div>
        </section>
      )}
    </div>
  );
}

function Messages({ conversations, setConversations, onSend, onViewBookings }: { conversations: Conversation[]; setConversations: (items: Conversation[]) => void; onSend: (conversationId: string, text: string) => Promise<Conversation["messages"][number]>; onViewBookings: () => void }) {
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationSearch, setConversationSearch] = useState("");
  const active = conversations.find((item) => item.id === activeId) ?? conversations[0];
  const threadEnd = useRef<HTMLDivElement>(null);
  const visibleConversations = conversations.filter((item) => `${item.person} ${item.role}`.toLowerCase().includes(conversationSearch.toLowerCase()));

  useEffect(() => { threadEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.messages.length]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !active) return;
    setSending(true);
    try {
      const message = await onSend(active.id, text);
      setConversations(conversations.map((item) => item.id === active.id ? { ...item, messages: [...item.messages, message] } : item));
      setDraft("");
    } finally {
      setSending(false);
    }
  };

  if (!active) return <div className="empty-state large"><MessageCircle size={32} /><h3>Aún no tienes conversaciones</h3><p>Cuando crees una solicitud de reserva, podrás conversar con el artista desde aquí.</p></div>;

  return (
    <section className="messages-layout">
      <aside className="conversation-list">
        <div className="conversation-list-head"><div><span>Bandeja</span><strong>{conversations.length} conversaciones</strong></div></div>
        <label className="conversation-search"><Search size={16} /><input value={conversationSearch} onChange={(event) => setConversationSearch(event.target.value)} placeholder="Buscar conversación" /></label>
        <div>
          {visibleConversations.map((conversation) => {
            const last = conversation.messages.at(-1);
            return (
              <button key={conversation.id} className={activeId === conversation.id ? "active" : ""} onClick={() => { setActiveId(conversation.id); setConversations(conversations.map((item) => item.id === conversation.id ? { ...item, unread: 0 } : item)); }}>
                <span className="conversation-avatar"><img src={conversation.avatar || artists[0].avatar} alt="" /><i /></span>
                <span className="conversation-preview"><strong>{conversation.person}</strong><small>{last?.text}</small></span>
                <span className="conversation-time">{last?.time}{conversation.unread > 0 && <b>{conversation.unread}</b>}</span>
              </button>
            );
          })}
          {visibleConversations.length === 0 && <div className="conversation-empty">No encontramos conversaciones.</div>}
        </div>
      </aside>

      <div className="message-panel">
        <header className="message-head"><div className="message-person"><img src={active.avatar || artists[0].avatar} alt="" /><div><strong>{active.person}</strong><span><i /> Conversación activa · {active.role}</span></div></div><div><button className="button button-secondary button-small" onClick={onViewBookings}><CalendarDays size={15} /> Ver reserva</button></div></header>
        <div className="message-context"><ShieldCheck size={16} /><span>Conversación protegida por Tinta. No compartas datos bancarios por mensaje.</span></div>
        <div className="message-thread">
          <span className="thread-date">Hoy</span>
          {active.messages.map((message) => <div key={message.id} className={`message-bubble ${message.from === "me" ? "mine" : "theirs"}`}><p>{message.text}</p><span>{message.time}</span></div>)}
          <div ref={threadEnd} />
        </div>
        <form className="message-composer" onSubmit={send}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escribe un mensaje…" aria-label="Mensaje" maxLength={1000} /><button className="send-button" aria-label="Enviar mensaje" disabled={sending || !draft.trim()}><Send size={18} /></button></form>
      </div>
    </section>
  );
}

function Favorites({ favorites, artistList, onProfile, onBook, onRemove, onExplore }: { favorites: string[]; artistList: Artist[]; onProfile: (artist: Artist) => void; onBook: (artist: Artist) => void; onRemove: (id: string) => void; onExplore: () => void }) {
  const items = artistList.filter((artist) => favorites.includes(artist.id));
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

function Dashboard({ bookings, portfolioCount, onRequest, onPortfolio, onAgenda }: { bookings: Booking[]; portfolioCount: number; onRequest: (id: string, decision: "accept" | "reject") => void; onPortfolio: () => void; onAgenda: () => void }) {
  const artistBookings = bookings.filter((booking) => booking.perspective === "artist");
  const requests = artistBookings.filter((booking) => booking.status === "En revisión");
  const scheduled = artistBookings.filter((booking) => booking.status === "Confirmada");
  const deposits = artistBookings.filter((booking) => booking.paymentStatus === "approved").reduce((sum, booking) => sum + (booking.depositAmount || 0), 0);
  return (
    <div className="page-stack">
      <section className="dashboard-welcome"><div><span className="eyebrow eyebrow-light"><Sparkles size={14} /> Resumen de tu cuenta</span><h2>{requests.length ? "Tu estudio está en movimiento." : "Tu perfil profesional está listo."}</h2><p>{requests.length ? `Tienes ${requests.length} solicitud${requests.length === 1 ? "" : "es"} esperando tu decisión.` : "Publica trabajos para aparecer en búsquedas y recibir nuevas solicitudes."}</p></div><button className="button button-light" onClick={onPortfolio}><Plus size={17} /> Publicar trabajo</button></section>
      <section className="metrics-grid">
        <MetricCard icon={Inbox} label="Solicitudes nuevas" value={String(requests.length)} delta="requieren respuesta" tone="orange" />
        <MetricCard icon={CalendarDays} label="Sesiones confirmadas" value={String(scheduled.length)} delta="en tu agenda" tone="purple" />
        <MetricCard icon={CircleDollarSign} label="Anticipos aprobados" value={formatClp(deposits)} delta="verificados por Mercado Pago" tone="green" />
        <MetricCard icon={Palette} label="Trabajos publicados" value={String(portfolioCount)} delta="visibles en tu perfil" tone="blue" />
      </section>
      <div className="dashboard-grid">
        <section className="panel-card requests-panel">
          <div className="panel-heading"><div><span>Solicitudes</span><h3>Nuevos proyectos</h3></div><button onClick={onAgenda}>Ver todas <ArrowRight size={15} /></button></div>
          <div className="request-list">
            {requests.map((request) => (
              <article key={request.id}>
                <span className="request-avatar">{(request.client || "CT").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
                <div className="request-copy"><div><strong>{request.client || "Cliente Tinta"}</strong><span>{displayBookingDate(request.date)}</span></div><h4>{request.style}</h4><p>{request.size} · {formatClp(request.price)}</p></div>
                <div className="request-actions"><button className="icon-button reject" aria-label={`Rechazar solicitud de ${request.client || "cliente"}`} onClick={() => onRequest(request.id, "reject")}><X size={17} /></button><button className="icon-button accept" aria-label={`Aceptar solicitud de ${request.client || "cliente"}`} onClick={() => onRequest(request.id, "accept")}><Check size={17} /></button></div>
              </article>
            ))}
            {requests.length === 0 && <div className="panel-empty"><Inbox size={22} /><strong>Sin solicitudes pendientes</strong><span>Las nuevas reservas pagadas aparecerán aquí.</span></div>}
          </div>
        </section>
        <section className="panel-card schedule-panel">
          <div className="panel-heading"><div><span>Agenda</span><h3>Próximas sesiones</h3></div><button onClick={onAgenda}>Agenda <ArrowRight size={15} /></button></div>
          <div className="schedule-list">
            {scheduled.slice(0, 3).map((booking) => <article key={booking.id}><time>{booking.time}</time><i className="schedule-line" /><div><span className="status status-confirmed"><i />Confirmada</span><h4>{booking.style} · {booking.client}</h4><p>{displayBookingDate(booking.date)} · {booking.size}</p></div></article>)}
            {scheduled.length === 0 && <div className="panel-empty"><CalendarDays size={22} /><strong>Sin sesiones confirmadas</strong><span>Al aceptar una solicitud aparecerá en tu agenda.</span></div>}
          </div>
        </section>
      </div>
    </div>
  );
}

type ArtistProfileSettings = { handle: string; studio: string; bio: string; styles: string[]; priceFrom: number; verified: boolean };

function Portfolio({ items, onAdd, onEdit, userName, profile }: { items: PortfolioItem[]; onAdd: () => void; onEdit: () => void; userName: string; profile: ArtistProfileSettings | null }) {
  return (
    <div className="page-stack">
      <section className="profile-banner">
        <div className="profile-banner-art"><span>INK</span></div>
        <div className="profile-summary"><span className="profile-large-avatar">{userName.charAt(0).toUpperCase()}</span><div><div className="profile-name"><h2>{userName}</h2>{profile?.verified && <BadgeCheck size={20} aria-label="Perfil profesional verificado" />}</div><p>{profile?.studio || "Estudio independiente"} · Perfil profesional</p><div className="tag-row">{(profile?.styles || ["Fine line"]).map((style) => <span key={style}>{style}</span>)}</div></div><button className="button button-secondary" onClick={onEdit}><Settings size={16} /> Editar perfil</button><button className="button button-primary" onClick={onAdd}><Upload size={16} /> Nuevo trabajo</button></div>
        <div className="profile-stats"><span><strong>{items.length}</strong> trabajos</span><span><strong>{formatClp(profile?.priceFrom || 60000)}</strong> precio inicial</span><span><strong>CLP</strong> moneda</span><span><strong>{profile?.verified ? "Verificado" : "Activo"}</strong> estado</span></div>
      </section>
      <section><SectionHeading kicker="Portafolio público" title="Tus trabajos" action={{ label: "Agregar trabajo", onClick: onAdd }} />{items.length ? <div className="portfolio-grid">{items.map((item) => <article key={item.id}><img src={item.image} alt={item.title} /><div><span>{item.style}</span><h3>{item.title}</h3><p><Heart size={14} fill="currentColor" /> {item.likes}</p></div></article>)}</div> : <div className="empty-state large"><ImagePlus size={30} /><h3>Tu portafolio está vacío</h3><p>Publica tu primer trabajo para aparecer en las búsquedas de clientes.</p><button className="button button-primary" onClick={onAdd}>Publicar trabajo</button></div>}</section>
    </div>
  );
}

function SettingsPage({ role, onRole, onToast, userName, userEmail, city, profile, paymentsConfigured, paymentMode, onSave }: { role: Role; onRole: (role: Role) => void; onToast: (text: string) => void; userName: string; userEmail: string; city: string; profile: ArtistProfileSettings | null; paymentsConfigured: boolean; paymentMode: string; onSave: (input: { displayName: string; city: string; artistProfile?: Pick<ArtistProfileSettings, "studio" | "bio" | "styles" | "priceFrom"> }) => Promise<void> }) {
  const [displayName, setDisplayName] = useState(userName);
  const [selectedCity, setSelectedCity] = useState(city);
  const [studio, setStudio] = useState(profile?.studio || "Estudio independiente");
  const [bio, setBio] = useState(profile?.bio || "");
  const [styles, setStyles] = useState(profile?.styles || ["Fine line"]);
  const [priceFrom, setPriceFrom] = useState(profile?.priceFrom || 60000);
  const [saving, setSaving] = useState(false);
  const toggleStyle = (style: string) => setStyles((current) => current.includes(style) ? (current.length > 1 ? current.filter((item) => item !== style) : current) : [...current, style].slice(0, 5));
  const reset = () => { setDisplayName(userName); setSelectedCity(city); setStudio(profile?.studio || "Estudio independiente"); setBio(profile?.bio || ""); setStyles(profile?.styles || ["Fine line"]); setPriceFrom(profile?.priceFrom || 60000); };
  const submit = async (event: FormEvent) => { event.preventDefault(); setSaving(true); try { await onSave({ displayName, city: selectedCity, ...(role === "artist" ? { artistProfile: { studio, bio, styles, priceFrom } } : {}) }); onToast("Configuración guardada"); } finally { setSaving(false); } };
  return (
    <div className="settings-layout">
      <form className="settings-form" onSubmit={submit}>
        <div className="settings-heading"><span>Perfil y preferencias</span><h2>Personaliza tu experiencia</h2><p>Estos datos se usan para recomendar artistas y organizar tu cuenta.</p></div>
        <div className="settings-section"><h3>Información personal</h3><div className="form-grid"><label><span>Nombre visible</span><input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={80} required /></label><label><span>Correo verificado</span><input type="email" value={userEmail} readOnly /></label><label><span>Ciudad</span><select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}><option>Santiago</option><option>Santiago Centro</option><option>Providencia</option><option>Ñuñoa</option><option>San Miguel</option></select></label></div></div>
        <div className="settings-section"><h3>Tipo de cuenta</h3><div className="account-choice"><button type="button" className={role === "client" ? "active" : ""} onClick={() => onRole("client")}><UserRound size={20} /><span><strong>Cliente</strong><small>Descubrir, guardar y reservar</small></span>{role === "client" && <Check size={18} />}</button><button type="button" className={role === "artist" ? "active" : ""} onClick={() => onRole("artist")}><Palette size={20} /><span><strong>Artista</strong><small>Agenda, solicitudes y portafolio</small></span>{role === "artist" && <Check size={18} />}</button></div></div>
        {role === "artist" && <div className="settings-section"><h3>Perfil profesional</h3><div className="form-grid"><label><span>Estudio</span><input value={studio} onChange={(event) => setStudio(event.target.value)} maxLength={100} required /></label><label><span>Precio inicial (CLP)</span><input type="number" min={30000} max={2000000} step={1000} value={priceFrom} onChange={(event) => setPriceFrom(Number(event.target.value))} required /></label></div><label className="settings-wide-field"><span>Especialidades (máximo 5)</span><div className="style-choice">{styleOptions.slice(1).map((style) => <button type="button" key={style} className={styles.includes(style) ? "active" : ""} onClick={() => toggleStyle(style)}>{styles.includes(style) && <Check size={14} />}{style}</button>)}</div></label><label className="settings-wide-field"><span>Presentación</span><textarea value={bio} onChange={(event) => setBio(event.target.value)} maxLength={600} placeholder="Describe tu enfoque, experiencia y forma de trabajo." /><small>{bio.length}/600</small></label></div>}
        <div className="settings-section"><h3>Seguridad y pagos</h3><div className="settings-status-grid"><article><ShieldCheck size={20} /><div><strong>Acceso con ChatGPT</strong><span>Tinta no almacena contraseñas.</span></div></article><article className={paymentsConfigured ? "is-ready" : ""}><WalletCards size={20} /><div><strong>{paymentsConfigured ? "Mercado Pago configurado" : "Mercado Pago pendiente"}</strong><span>{paymentsConfigured ? `Modo ${paymentMode === "production" ? "producción" : "sandbox"}` : "El administrador debe agregar ambos secretos."}</span></div></article></div></div>
        <div className="settings-save"><button type="button" className="button button-secondary" onClick={reset}>Restablecer</button><button className="button button-primary" disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button></div>
      </form>
    </div>
  );
}

function ArtistModal({ artist, favorite, onClose, onFavorite, onBook }: { artist: Artist; favorite: boolean; onClose: () => void; onFavorite: () => void; onBook: () => void }) {
  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-label={`Perfil de ${artist.name}`}>
      <button className="modal-scrim" aria-label="Cerrar" onClick={onClose} />
      <div className="modal-card artist-modal">
        <div className="artist-modal-cover">{artist.cover ? <img src={artist.cover} alt={`Portafolio de ${artist.name}`} /> : <div className="artist-cover-placeholder"><Palette size={34} /><span>Portafolio en preparación</span></div>}<button className="modal-close" onClick={onClose} aria-label="Cerrar perfil"><X size={20} /></button></div>
        <div className="artist-modal-content">
          <div className="artist-modal-head"><ArtistAvatar artist={artist} /><div><h2>{artist.name} {artist.verified && <BadgeCheck size={19} aria-label="Perfil verificado" />}</h2><p>{artist.handle} · {artist.studio}</p></div>{artist.reviews > 0 && <span className="rating"><Star size={14} fill="currentColor" /> {artist.rating} ({artist.reviews})</span>}</div>
          <p className="artist-bio">{artist.bio}</p>
          <div className="artist-facts"><span><MapPin size={16} /><strong>{artist.city}</strong><small>{artist.distance}</small></span><span><CalendarDays size={16} /><strong>Disponible</strong><small>acepta solicitudes</small></span><span><CircleDollarSign size={16} /><strong>{formatClp(artist.priceFrom)}</strong><small>precio inicial</small></span></div>
          {artist.work.length > 0 && <div className="modal-portfolio">{artist.work.map((image, index) => <img key={image} src={image} alt={`Trabajo ${index + 1} de ${artist.name}`} />)}</div>}
          <div className="artist-modal-actions"><button className={`button button-secondary ${favorite ? "is-favorite" : ""}`} onClick={onFavorite}><Heart size={17} fill={favorite ? "currentColor" : "none"} />{favorite ? "Guardado" : "Guardar"}</button><button className="button button-primary" onClick={onBook}>Solicitar reserva <ArrowRight size={17} /></button></div>
        </div>
      </div>
    </div>
  );
}

type BookingDraft = { artistId: string; style: string; placement: string; size: string; date: string; time: string; notes: string };

function BookingModal({ artist, initialDate, onClose, onConfirm }: { artist: Artist; initialDate: string; onClose: () => void; onConfirm: (booking: BookingDraft) => Promise<void> }) {
  const [style, setStyle] = useState(artist.styles[0]);
  const [placement, setPlacement] = useState("Antebrazo");
  const [size, setSize] = useState("Mediano");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(times[2]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const price = artist.priceFrom + (size === "Grande" ? 70000 : size === "Mediano" ? 30000 : 0);
  const deposit = Math.max(10000, Math.round((price * 0.2) / 1000) * 1000);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true); setError("");
    try { await onConfirm({ artistId: artist.id, style, placement, size, date, time, notes }); }
    catch (bookingError) { setError(bookingError instanceof Error ? bookingError.message : "No pudimos crear la reserva."); }
    finally { setBusy(false); }
  };
  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Solicitar reserva">
      <button className="modal-scrim" aria-label="Cerrar" onClick={onClose} />
      <form className="modal-card booking-modal" onSubmit={submit}>
        <header><div><span className="eyebrow"><CalendarDays size={14} /> Solicitud de reserva</span><h2>Cuéntale tu idea a {artist.name.split(" ")[0]}</h2><p>Crearemos la solicitud y luego podrás pagar el anticipo seguro con Mercado Pago.</p></div><button type="button" className="modal-close static" onClick={onClose}><X size={20} /></button></header>
        <div className="booking-artist-mini"><img src={artist.avatar} alt="" /><div><strong>{artist.name}</strong><span>{artist.studio} · {artist.city}</span></div><span className="rating"><Star size={14} fill="currentColor" /> {artist.rating}</span></div>
        <div className="booking-form-grid"><label><span>Estilo</span><select value={style} onChange={(event) => setStyle(event.target.value)}>{artist.styles.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Zona del cuerpo</span><select value={placement} onChange={(event) => setPlacement(event.target.value)}><option>Antebrazo</option><option>Brazo</option><option>Pantorrilla</option><option>Espalda</option><option>Otro</option></select></label><label><span>Tamaño aproximado</span><select value={size} onChange={(event) => setSize(event.target.value)}><option>Pequeño</option><option>Mediano</option><option>Grande</option></select></label><label><span>Fecha preferida</span><input type="date" min={initialDate} value={date} onChange={(event) => setDate(event.target.value)} required /></label></div>
        <fieldset className="time-picker"><legend>Horario preferido</legend><div>{times.map((item) => <button type="button" className={time === item ? "active" : ""} key={item} onClick={() => setTime(item)}>{item}</button>)}</div></fieldset>
        <label className="notes-field"><span>Describe tu idea <small>opcional</small></span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Concepto, referencias, colores y cualquier detalle que ayude al artista…" maxLength={400} /><small>{notes.length}/400</small></label>
        <div className="booking-total"><span><small>Valor estimado</small><strong>{formatClp(price)}</strong></span><span><small>Anticipo (20%)</small><strong>{formatClp(deposit)}</strong></span><p><ShieldCheck size={15} /> Si el artista rechaza la solicitud pagada, Tinta solicita automáticamente la devolución íntegra a Mercado Pago.</p></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <footer><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button className="button button-primary" disabled={busy}>{busy ? "Creando…" : "Crear solicitud"} <ArrowRight size={17} /></button></footer>
      </form>
    </div>
  );
}

function UploadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (form: FormData) => Promise<PortfolioItem> }) {
  const [title, setTitle] = useState("");
  const [style, setStyle] = useState("Fine line");
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => () => { if (image) URL.revokeObjectURL(image); }, [image]);
  const chooseFile = (next: File | undefined) => { if (!next) return; if (image) URL.revokeObjectURL(image); setFile(next); setImage(URL.createObjectURL(next)); setError(""); };
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!title.trim() || !file) { setError("Selecciona una fotografía y escribe un título."); return; } setBusy(true); setError(""); try { const form = new FormData(); form.set("title", title); form.set("style", style); form.set("image", file); await onAdd(form); } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "No pudimos publicar la imagen."); } finally { setBusy(false); } };
  return <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Publicar trabajo"><button className="modal-scrim" aria-label="Cerrar" onClick={onClose} /><form className="modal-card upload-modal" onSubmit={submit}><header><div><span className="eyebrow"><ImagePlus size={14} /> Portafolio</span><h2>Publicar un nuevo trabajo</h2><p>JPG, PNG o WebP · máximo 8 MB.</p></div><button type="button" className="modal-close static" onClick={onClose}><X size={20} /></button></header><label className={`upload-drop ${!image ? "is-empty" : ""}`}><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseFile(event.target.files?.[0])} required />{image ? <img src={image} alt="Vista previa" /> : <span className="upload-placeholder"><ImagePlus size={30} /> Seleccionar fotografía</span>}<span><Upload size={18} /> {image ? "Cambiar fotografía" : "Subir fotografía"}</span></label><div className="booking-form-grid"><label><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Botánica en movimiento" required maxLength={100} /></label><label><span>Estilo</span><select value={style} onChange={(event) => setStyle(event.target.value)}>{styleOptions.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label></div>{error && <p className="form-error" role="alert">{error}</p>}<footer><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button className="button button-primary" disabled={busy}>{busy ? "Publicando…" : "Publicar trabajo"}</button></footer></form></div>;
}

function Toast({ text }: { text: string }) { return <div className="toast"><span><Check size={16} /></span>{text}</div>; }

type Account = { id?: string; displayName: string; email: string; role: Role; city: string; artistProfile?: ArtistProfileSettings | null };
type AccountSnapshot = { user: Account; favorites: string[]; bookings: Booking[]; portfolio: PortfolioItem[]; conversations: Conversation[]; payments: { configured: boolean; mode: string } };

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "Ocurrió un problema. Inténtalo nuevamente.");
  return data;
}

export default function TintaApp({ identity }: { identity: { displayName: string; email: string } }) {
  const [role, setRole] = useState<Role>("client");
  const [view, setView] = useState<View>("discover");
  const [account, setAccount] = useState<Account>({ displayName: identity.displayName, email: identity.email, role: "client", city: "Santiago" });
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [artistList, setArtistList] = useState<Artist[]>(artists);
  const [profileArtist, setProfileArtist] = useState<Artist | null>(null);
  const [bookingArtist, setBookingArtist] = useState<Artist | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentsConfigured, setPaymentsConfigured] = useState(false);
  const [paymentMode, setPaymentMode] = useState("sandbox");
  const [payingId, setPayingId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      requestJson<AccountSnapshot>("/api/account"),
      requestJson<{ artists: Array<Partial<Artist> & { id: string; cover: string | null }> }>("/api/artists").catch(() => ({ artists: [] })),
    ]).then(([snapshot, liveArtists]) => {
      if (!active) return;
      setAccount(snapshot.user); setRole(snapshot.user.role); setView(snapshot.user.role === "artist" ? "dashboard" : "discover"); setFavorites(snapshot.favorites); setBookings(snapshot.bookings); setPortfolio(snapshot.portfolio); setConversations(snapshot.conversations); setPaymentsConfigured(snapshot.payments.configured); setPaymentMode(snapshot.payments.mode);
      const mapped = liveArtists.artists.map((item, index): Artist => {
        const fallback = artists[index % artists.length];
        const cover = item.cover || "";
        return { ...fallback, ...item, id: item.id, name: item.name || `Artista ${index + 1}`, handle: item.handle || `@artista.${index + 1}`, studio: item.studio || "Estudio independiente", city: item.city || "Santiago", styles: item.styles?.length ? item.styles : ["Fine line"], priceFrom: Number(item.priceFrom || 60000), bio: item.bio || "Artista independiente de la comunidad Tinta.", verified: Boolean(item.verified), cover, avatar: cover, work: cover ? [cover] : [], rating: 0, reviews: 0, distance: "Comunidad Tinta", nextSlot: "" };
      });
      setArtistList(mapped.filter((artist) => artist.id !== snapshot.user.id));
    }).catch((error) => {
      if (active) setToast(error instanceof Error ? error.message : "No pudimos cargar tu cuenta.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setView("discover");
        window.setTimeout(() => searchRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const notifications = useMemo(() => bookings
    .filter((booking) => role === "artist" ? booking.perspective === "artist" : booking.perspective !== "artist")
    .filter((booking) => role === "artist" ? booking.status === "En revisión" : ["Esperando anticipo", "Confirmada", "Reembolsada"].includes(booking.status))
    .slice(0, 5)
    .map((booking) => ({
      id: booking.id,
      title: booking.status === "Esperando anticipo" ? "Anticipo pendiente" : booking.status === "En revisión" ? "Solicitud por revisar" : `Reserva ${booking.status.toLowerCase()}`,
      text: `${booking.artist} · ${displayBookingDate(booking.date)} a las ${booking.time}`,
    })), [bookings, role]);

  const changeRole = async (nextRole: Role) => {
    const previous = role;
    setRole(nextRole);
    setView((current) => current === "settings" ? "settings" : nextRole === "artist" ? "dashboard" : "discover");
    try {
      const result = await requestJson<{ user: Account }>("/api/account", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ role: nextRole }) });
      setAccount(result.user);
      setToast(nextRole === "artist" ? "Tu perfil profesional está activo" : "Cambiaste al modo cliente");
    } catch (error) {
      setRole(previous); setView((current) => current === "settings" ? "settings" : previous === "artist" ? "dashboard" : "discover"); setToast(error instanceof Error ? error.message : "No pudimos cambiar el modo.");
    }
  };

  const toggleFavorite = async (id: string) => {
    const removing = favorites.includes(id);
    setFavorites(removing ? favorites.filter((item) => item !== id) : [...favorites, id]);
    try {
      await requestJson("/api/favorites", { method: removing ? "DELETE" : "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ artistId: id }) });
      setToast(removing ? "Quitado de favoritos" : "Artista guardado en favoritos");
    } catch (error) {
      setFavorites(favorites); setToast(error instanceof Error ? error.message : "No pudimos guardar el favorito.");
    }
  };

  const openBooking = (artist: Artist) => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    setBookingDate(nextWeek.toISOString().slice(0, 10));
    setBookingArtist(artist);
  };

  const confirmBooking = async (draft: BookingDraft) => {
    const result = await requestJson<{ booking: Booking }>("/api/bookings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draft) });
    setBookings([result.booking, ...bookings]);
    setBookingArtist(null);
    setProfileArtist(null);
    setView("bookings");
    setToast("Solicitud creada. Completa el anticipo para enviarla al artista.");
  };

  const payBooking = async (booking: Booking) => {
    if (!paymentsConfigured) { setToast("La integración está lista; faltan las credenciales de Mercado Pago para cobrar."); return; }
    setPayingId(booking.id);
    try {
      const result = await requestJson<{ checkoutUrl: string }>(`/api/bookings/${booking.id}/checkout`, { method: "POST" });
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "No pudimos iniciar el pago."); setPayingId(null);
    }
  };

  const sendMessage = async (conversationId: string, text: string) => {
    const result = await requestJson<{ message: Conversation["messages"][number] }>("/api/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ conversationId, text }) });
    return result.message;
  };

  const saveProfile = async (input: { displayName: string; city: string; artistProfile?: Pick<ArtistProfileSettings, "studio" | "bio" | "styles" | "priceFrom"> }) => {
    const result = await requestJson<{ user: Account }>("/api/account", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
    setAccount(result.user);
  };

  const uploadPortfolio = async (form: FormData) => {
    const result = await requestJson<{ item: PortfolioItem }>("/api/portfolio", { method: "POST", body: form });
    setPortfolio([result.item, ...portfolio]); setUploadOpen(false); setToast("Trabajo publicado en tu portafolio");
    return result.item;
  };

  const handleRequest = async (id: string, decision: "accept" | "reject") => {
    try {
      const result = await requestJson<{ status: Booking["status"] }>(`/api/bookings/${id}/decision`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ decision }) });
      setBookings(bookings.map((booking) => booking.id === id ? { ...booking, status: result.status } : booking));
      setToast(decision === "accept" ? "Solicitud aceptada y agregada a tu agenda" : "Solicitud rechazada y anticipo reembolsado");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "No pudimos actualizar la solicitud.");
    }
  };

  if (loading) return <div className="app-loading"><Logo /><span className="loading-ring" /><p>Preparando tu estudio…</p></div>;

  return (
    <div className="app-shell">
      <Sidebar role={role} view={view} favoritesCount={favorites.length} messagesCount={conversations.length} onNavigate={setView} onRoleChange={changeRole} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} userName={account.displayName} userEmail={account.email} />
      <div className="app-main">
        <Topbar role={role} view={view} search={search} onSearch={setSearch} onMenu={() => setMobileOpen(true)} notificationsOpen={notificationsOpen} onNotifications={() => setNotificationsOpen(!notificationsOpen)} userName={account.displayName} notifications={notifications} onSettings={() => setView("settings")} searchRef={searchRef} />
        <main className="page-content" onClick={() => notificationsOpen && setNotificationsOpen(false)}>
          {view === "discover" && <Discover search={search} favorites={favorites} artistList={artistList} onFavorite={toggleFavorite} onProfile={setProfileArtist} onBook={openBooking} />}
          {view === "bookings" && <Bookings bookings={bookings} role={role} onExplore={() => setView("discover")} onMessage={() => setView("messages")} onPay={payBooking} payingId={payingId} paymentsConfigured={paymentsConfigured} />}
          {view === "messages" && <Messages conversations={conversations} setConversations={setConversations} onSend={sendMessage} onViewBookings={() => setView("bookings")} />}
          {view === "favorites" && <Favorites favorites={favorites} artistList={artistList} onProfile={setProfileArtist} onBook={openBooking} onRemove={toggleFavorite} onExplore={() => setView("discover")} />}
          {view === "dashboard" && <Dashboard bookings={bookings} portfolioCount={portfolio.length} onRequest={handleRequest} onPortfolio={() => setView("portfolio")} onAgenda={() => setView("bookings")} />}
          {view === "portfolio" && <Portfolio items={portfolio} onAdd={() => setUploadOpen(true)} onEdit={() => setView("settings")} userName={account.displayName} profile={account.artistProfile || null} />}
          {view === "settings" && <SettingsPage key={`${role}-${account.displayName}-${account.city}-${account.artistProfile?.studio || "none"}`} role={role} onRole={changeRole} onToast={setToast} userName={account.displayName} userEmail={account.email} city={account.city} profile={account.artistProfile || null} paymentsConfigured={paymentsConfigured} paymentMode={paymentMode} onSave={saveProfile} />}
        </main>
      </div>
      {profileArtist && <ArtistModal artist={profileArtist} favorite={favorites.includes(profileArtist.id)} onClose={() => setProfileArtist(null)} onFavorite={() => toggleFavorite(profileArtist.id)} onBook={() => { openBooking(profileArtist); setProfileArtist(null); }} />}
      {bookingArtist && <BookingModal artist={bookingArtist} initialDate={bookingDate} onClose={() => setBookingArtist(null)} onConfirm={confirmBooking} />}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onAdd={uploadPortfolio} />}
      {toast && <Toast text={toast} />}
    </div>
  );
}
