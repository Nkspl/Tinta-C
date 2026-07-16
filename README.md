# Tinta

Marketplace full-stack para descubrir artistas del tatuaje en Chile, publicar portafolios, conversar, reservar sesiones y cobrar anticipos en CLP mediante Mercado Pago.

## Funciones principales

- inicio de sesión administrado por ChatGPT/Sites, sin contraseñas almacenadas por Tinta;
- cuentas con modo cliente y artista;
- perfiles profesionales configurables;
- artistas, favoritos, reservas, conversaciones y mensajes persistentes;
- portafolios con imágenes JPG, PNG o WebP almacenadas en R2;
- anticipos del 20 % mediante Mercado Pago Checkout Pro;
- webhooks firmados, verificación de monto y moneda, idempotencia y devolución al rechazar;
- interfaz responsive y accesible para escritorio, tablet y móvil.

## Tecnologías

- TypeScript, React 19 y componentes del App Router de Next.js;
- Vinext y Vite para ejecutar el proyecto sobre Cloudflare Workers;
- Cloudflare D1 (SQL/SQLite distribuido) para los datos;
- Drizzle ORM y migraciones SQL para el esquema;
- Cloudflare R2 para las imágenes;
- Mercado Pago Checkout Pro para pagos en CLP;
- CSS, Tailwind CSS 4 y Lucide React para la interfaz;
- Node.js Test Runner, TypeScript y ESLint para validación.

## Ejecutar en VS Code

### Requisitos

- Node.js 22.13 o superior;
- Git;
- VS Code;
- en Windows, WSL2 es la opción recomendada para ejecutar también los scripts completos de build.

### Instalación

```bash
git clone https://github.com/Nkspl/Tinta-C.git
cd Tinta-C
npm ci
```

Para desarrollo sin cobros reales no necesitas credenciales. El entorno local usa una identidad de prueba y crea D1/R2 locales mediante Miniflare.

Si necesitas probar la creación de preferencias de Mercado Pago, copia el archivo de ejemplo y usa exclusivamente credenciales de prueba:

```bash
cp .env.example .env
```

Completa en `.env`:

```dotenv
MP_ACCESS_TOKEN="TEST-..."
MP_WEBHOOK_SECRET="..."
MP_MODE="sandbox"
```

No subas `.env` ni credenciales reales a Git.

### Iniciar

Abre la carpeta en VS Code:

```bash
code .
npm run dev
```

Vite mostrará la URL local en la terminal, normalmente `http://localhost:5173`.

Los datos locales se guardan bajo `.wrangler/`. Para probar webhooks reales necesitas una URL HTTPS pública; Mercado Pago no puede llamar directamente a `localhost`.

### Validaciones

```bash
npm run typecheck
npm run lint
npm test
npm audit --omit=dev
```

`npm test` ejecuta el typecheck, crea el artefacto de producción y corre las pruebas de rutas y seguridad. Los scripts de build del hosting usan Bash; en Windows ejecútalos dentro de WSL2.

## Configuración de producción

El despliegue necesita los bindings declarados en `.openai/hosting.json`:

- `DB`: base de datos D1;
- `BUCKET`: bucket R2;
- `MP_ACCESS_TOKEN`: secreto de Mercado Pago;
- `MP_WEBHOOK_SECRET`: secreto de firma del webhook;
- `MP_MODE`: `sandbox` o `production`.

El webhook de producción es `/api/payments/webhook`. Tinta solo habilita el botón de pago cuando están configurados tanto el token como el secreto del webhook.
