/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowRight, CalendarDays, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { artists } from "./data";

function LoginLogo() {
  return (
    <div className="brand" aria-label="Tinta">
      <span className="brand-mark" aria-hidden="true">T</span>
      <span className="brand-copy"><strong>Tinta</strong><small>arte que permanece</small></span>
    </div>
  );
}

export default function Login() {
  return (
    <main className="welcome-shell login-only-shell">
      <header className="welcome-nav">
        <LoginLogo />
        <span className="secure-login-note"><ShieldCheck size={16} /> Acceso protegido</span>
      </header>
      <section className="welcome-grid">
        <div className="welcome-copy">
          <div className="eyebrow"><Sparkles size={15} /> La comunidad creativa de Tinta</div>
          <h1>Tu historia merece<br /><em>la tinta correcta.</em></h1>
          <p className="welcome-lead">Inicia sesión para descubrir artistas, guardar favoritos, conversar y reservar con pagos protegidos.</p>
          <div className="welcome-actions login-actions">
            <Link className="button button-primary button-large" href="/signin-with-chatgpt?return_to=%2F">
              Iniciar sesión con ChatGPT <ArrowRight size={18} />
            </Link>
            <small>Usamos tu identidad de ChatGPT. Tinta no recibe ni almacena tu contraseña.</small>
          </div>
          <div className="trust-row" aria-label="Ventajas de Tinta">
            <span><ShieldCheck size={17} /> Cuenta verificada</span>
            <span><WalletCards size={17} /> Mercado Pago</span>
            <span><CalendarDays size={17} /> Reservas persistentes</span>
          </div>
        </div>
        <div className="welcome-visual" aria-label="Selección de trabajos y artistas">
          <div className="welcome-orbit orbit-one" /><div className="welcome-orbit orbit-two" />
          <article className="hero-photo hero-photo-main"><img src={artists[0].cover} alt="Trabajo de tatuaje fine line" /><div className="hero-photo-caption"><div><span className="caption-kicker">Comunidad verificada</span><strong>Encuentra tu próximo artista</strong></div><span className="round-icon"><ArrowRight size={18} /></span></div></article>
          <article className="hero-photo hero-photo-small"><img src={artists[1].cover} alt="Trabajo de tatuaje blackwork" /><span>Blackwork</span></article>
          <div className="artist-floating-card"><img src={artists[0].avatar} alt="Artista de la comunidad Tinta" /><div><strong>Comunidad Tinta</strong><span>Perfiles profesionales · Chile</span></div><ShieldCheck size={20} /></div>
        </div>
      </section>
      <footer className="welcome-footer"><span>Hecho para la comunidad creativa de Chile.</span><span>Pagos procesados por Mercado Pago.</span></footer>
    </main>
  );
}
