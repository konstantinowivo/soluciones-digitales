# Digital Solutions — sitio comercial

Sitio one-page para conseguir consultas de clientes: servicios, formulario con envío real, WhatsApp contextual, SEO y eventos de conversión listos para Google Ads.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · Lucide React. Sin backend propio: el formulario usa [Web3Forms](https://web3forms.com).

---

## Instalación

Requiere Node.js 20.19 o superior.

```bash
npm install
cp .env.example .env   # completar las variables (ver abajo)
```

## Desarrollo

```bash
npm run dev        # servidor local en http://localhost:5173
npm run typecheck  # chequeo de TypeScript
npm run lint       # oxlint
npm run check      # typecheck + lint + build, todo junto
```

En desarrollo aparece un aviso abajo a la izquierda con las variables de entorno que faltan. Ese aviso nunca se muestra en producción.

## Variables de entorno

Todas se leen en un único lugar: `src/config/env.ts`. Ningún componente accede a `import.meta.env` directamente.

| Variable | Obligatoria | Para qué sirve |
| --- | --- | --- |
| `VITE_SITE_URL` | Sí | URL final sin barra al final (`https://www.tudominio.com.ar`). Canonical, Open Graph, sitemap y robots. |
| `VITE_WHATSAPP_NUMBER` | Sí | Número internacional, solo dígitos. Argentina móvil: `549` + área + número. |
| `VITE_CONTACT_EMAIL` | No | Email que se **muestra** en contacto y footer. Vacío = no se muestra. Las consultas llegan al email de la access key de Web3Forms. |
| `VITE_WEB3FORMS_ACCESS_KEY` | Sí | Access key de Web3Forms para que el formulario envíe. |
| `VITE_GA_ID` | No | Google Analytics 4 (`G-XXXXXXXXXX`). |
| `VITE_GTM_ID` | No | Google Tag Manager (`GTM-XXXXXXX`). |

Todas las variables `VITE_` terminan en el código público del navegador. No son secretos y no se debe poner ninguna clave privada con ese prefijo. `.env` está en `.gitignore`.

Comportamiento si falta alguna:

- **Sin número de WhatsApp:** los botones de WhatsApp no se muestran, así que nunca queda un link roto.
- **Sin email:** no se muestra en contacto ni en el footer.
- **Sin access key:** el formulario valida, pero al enviar muestra un error y ofrece WhatsApp o email.
- **Sin `VITE_SITE_URL`:** el build avisa, no genera `sitemap.xml` y canonical y Open Graph quedan relativos.

## Build

```bash
npm run build     # genera dist/
npm run preview   # sirve dist/ en http://localhost:4173
```

El build hace tres cosas:

1. Compila la app.
2. Genera `robots.txt` y `sitemap.xml` con `VITE_SITE_URL`.
3. **Pre-renderiza** la home dentro de `dist/index.html` (`scripts/prerender.mjs`). Google y las vistas previas de redes ven el contenido completo sin ejecutar JavaScript, y la página se ve antes de que cargue React.

## Deploy en Vercel

1. Subir el repo a GitHub.
2. En Vercel: **Add New → Project** e importar el repo. `vercel.json` ya define el framework, el comando de build (`npm run build`) y la carpeta de salida (`dist`).
3. En **Settings → Environment Variables**, cargar las variables de la tabla para *Production* (y *Preview* si querés probar ahí).
4. Deploy.
5. Para el dominio propio: **Settings → Domains → Add**, y configurar los DNS que indique Vercel.
6. Actualizar `VITE_SITE_URL` con el dominio definitivo y volver a desplegar, así el sitemap y el canonical apuntan al dominio correcto.
7. En Google Search Console, verificar el dominio y enviar `https://tudominio/sitemap.xml`.

Las variables se incrustan en el build: después de cambiar cualquiera hay que redeployar.

`vercel.json` también agrega caché larga para `/assets/*` y headers básicos de seguridad (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`). Las rutas inexistentes muestran `public/404.html`.

## Configuración de WhatsApp

- **Número:** `VITE_WHATSAPP_NUMBER`. Por ejemplo, para 351 123-4567 → `5493511234567`. Se limpia de espacios o guiones automáticamente.
- **Links:** siempre `https://wa.me/<numero>?text=<mensaje>` (`src/lib/whatsapp.ts`).
- **Mensajes:** están en `src/data/contact.ts`:
  - `DEFAULT_WHATSAPP_MESSAGE` es el mensaje general.
  - `whatsappMessageByNeed` tiene un mensaje por necesidad. Si el visitante elige "Quiero vender online" (o esa opción en el formulario), el botón flotante y los CTA de WhatsApp pasan a decir "Hola, quiero consultar por el desarrollo de un e-commerce."

## Configuración del formulario

Se eligió **Web3Forms** por ser gratuito (plan free con 250 envíos/mes al momento de escribir esto), no requerir backend y tener filtro de spam propio.

1. Entrar a <https://web3forms.com>, ingresar el email donde querés recibir las consultas y copiar la **Access Key** que llega por mail.
2. Cargarla en `VITE_WEB3FORMS_ACCESS_KEY` (en `.env` y en Vercel).
3. Probar un envío real desde el sitio desplegado.

**Qué llega al email:** nombre, email (queda como *reply-to*, así que respondés directo), empresa, WhatsApp, necesidad y mensaje. El asunto es "Nueva consulta: <necesidad>".

**Protección contra spam:**

- Campo trampa (*honeypot* `botcheck`), invisible para personas.
- Se descartan en silencio los envíos hechos menos de 3 segundos después de cargar el formulario.
- Límite de 3 enlaces por mensaje y límites de largo en todos los campos.
- Sanitización del texto antes de enviar (`src/lib/sanitize.ts`).
- Filtro de spam de Web3Forms del lado del servidor.

Si más adelante llega spam igual, Web3Forms permite sumar hCaptcha desde su panel. Ver la documentación de Web3Forms para agregar el widget.

**Privacidad:** el sitio no guarda los datos del formulario en el navegador ni en ninguna base; solo se envían a Web3Forms para que lleguen a tu email.

**Cambiar de proveedor:** toda la lógica de envío está en `submitInquiry()` dentro de `src/lib/inquiry.ts`. Para usar Formspree, Resend (con una función serverless) u otro endpoint, se cambia esa función y el resto del formulario queda igual.

## Google Analytics

1. Crear una propiedad GA4 y copiar el **ID de medición** (`G-...`).
2. Cargarlo en `VITE_GA_ID`.
3. Sin ID no se carga ningún script. El script se carga después del primer render para no afectar la velocidad.

Eventos que envía el sitio (`src/lib/analytics.ts`):

| Evento | Cuándo | Parámetros |
| --- | --- | --- |
| `generate_lead` | Formulario enviado con éxito | `location`, `need` |
| `whatsapp_click` | Clic en cualquier botón o link de WhatsApp | `location` (`floating_button`, `services`, `final_cta`, etc.), `need` |
| `quote_cta_click` | Clic en "Solicitar presupuesto" o en las tarjetas de necesidad | `location`, `need` |
| `view_services_click` | Clic en "Ver servicios" (hero) | `location` |
| `form_start` | Primer foco en el formulario (una vez por visita) | `location`, `need` |
| `email_click` | Clic en el email de contacto | `location` |
| `form_error` | El envío del formulario falló | `location`, `kind` (`offline`, `network`, `timeout`, `rate_limit`, `server`, `rejected`, `not_configured`), `need` |

`form_start` vs. `generate_lead` muestra cuánta gente empieza el formulario y no lo termina.

**Para Google Ads:** en GA4 marcá `generate_lead` y `whatsapp_click` como **eventos clave** y después importalos como conversiones en Google Ads (**Herramientas → Conversiones → Importar → Google Analytics 4**).

En desarrollo, los eventos se muestran en la consola del navegador con `console.debug`.

## Google Tag Manager

1. Crear el contenedor y cargar el ID en `VITE_GTM_ID`.
2. Cada evento de la tabla anterior se publica en `dataLayer` como `{ event: '<nombre>', location, need }`. En GTM se crean disparadores de tipo **Evento personalizado** con esos nombres.
3. Si usás GTM, configurá GA4 dentro de GTM y dejá `VITE_GA_ID` vacío, para no contar cada visita dos veces.

## Cómo modificar servicios

- **Tarjetas "¿Qué necesitás resolver?":** `src/data/needs.ts`. Cada tarjeta tiene su texto, su CTA, un ícono de Lucide y la opción `need` que preselecciona en el formulario.
- **Lista de servicios:** `services` en `src/data/services.ts`. El campo `slug` reserva la URL de la futura landing de ese servicio.
- **Tecnologías:** `techGroups` en `src/data/technologies.ts`, agrupadas por sector. Logos de [simple-icons](https://simpleicons.org) con su color oficial; las marcas que no están ahí (AWS, Salesforce, Tiendanube) son SVG en `src/assets/logos/`.
- **Pasos del proceso:** `src/data/process.ts`.
- **Opciones del formulario:** `needOptions` en `src/data/contact.ts`. Si agregás una opción, sumale también su mensaje en `whatsappMessageByNeed`; TypeScript avisa si falta.
- **Sección Nosotros y bloque "¿Quiénes somos?":** `approach` y `team` en `src/data/about.ts`.
- **Preguntas frecuentes:** `src/data/faq.ts`. Se muestran en la home y se publican como datos estructurados `FAQPage` para Google.
- **Testimonios:** `src/data/testimonials.ts`. La sección aparece sola cuando el array tiene al menos uno. Cargar solo testimonios reales y con autorización del cliente.

## Cómo cambiar información de contacto

- **Número de WhatsApp y email:** solo en `.env` y en Vercel (`VITE_WHATSAPP_NUMBER`, `VITE_CONTACT_EMAIL`), nunca en el código.
- **Marca, bajada del logo, ubicación, cobertura, texto del hero y año del copyright:** `src/config/site.ts`.
- **Ítems del menú:** `navItems` en `src/config/site.ts`. El `id` tiene que coincidir con el `id` de la sección.
- **Textos del hero** (línea superior, H1 y bajada): `heroEyebrow`, `heroTitle` y `heroSubtitle` en `src/config/site.ts`.
- **Textos SEO** (title, description, Open Graph): `index.html`. Los datos estructurados (JSON-LD) se generan en `vite.config.ts` con `site.ts`, las FAQ, el teléfono y el email.
- **Política de privacidad:** `legal/privacidad.html` (se publica en `/privacidad` con el email de contacto). La imagen para redes está en `public/og-image.png` (1200×630).

## Landing pages por servicio (siguiente etapa)

La arquitectura ya está preparada para `/desarrollo-web`, `/ecommerce`, `/sistemas-a-medida`, `/automatizacion` e `/integraciones`:

1. Instalar el router: `npm install react-router`.
2. Crear las páginas en `src/pages/` reutilizando las secciones de `src/components/sections/` y los datos de `src/data/`.
3. En `App.tsx`, envolver `HomePage` y las nuevas páginas en las rutas del router.
4. Pre-renderizar cada ruta: extender `scripts/prerender.mjs` para que genere `dist/<ruta>/index.html` por cada ruta publicada.
5. Marcar la ruta con `published: true` en `src/config/routes.ts` para que entre en el sitemap.
6. Darle a cada página su propio title, description y canonical.

## Estructura

```
src/
├── components/
│   ├── layout/      Navbar, Footer, Logo, WhatsApp flotante, aviso de config (dev)
│   ├── sections/    Hero, Needs, Services/Technology, Process, About, Testimonials, Faq, FinalCta, Contact
│   ├── forms/       ContactForm
│   └── ui/          ButtonLink, QuoteLink, WhatsAppLink, SectionHeading, WhatsAppIcon
├── config/          env.ts, site.ts, routes.ts
├── context/         necesidad elegida (para formulario y WhatsApp)
├── data/            needs, services, technologies, process, about, faq, contact, testimonials
├── hooks/           useContactIntent, useActiveSection
├── lib/             analytics, inquiry (validación + envío), whatsapp, sanitize
├── pages/           HomePage
├── entry-server.tsx render estático para el pre-renderizado
└── main.tsx
scripts/prerender.mjs
public/              favicon, íconos, og-image, 404.html
```

## Checklist antes de publicar

- [ ] Variables cargadas en Vercel: `VITE_SITE_URL`, `VITE_WHATSAPP_NUMBER`, `VITE_WEB3FORMS_ACCESS_KEY` (y `VITE_CONTACT_EMAIL` solo si querés mostrar un email).
- [ ] Envío de prueba del formulario recibido en el email.
- [ ] El botón de WhatsApp abre el chat con el número correcto.
- [ ] El texto de `src/data/about.ts` revisado.
- [ ] GA4 o GTM configurado y `generate_lead` / `whatsapp_click` marcados como conversiones.
- [ ] Sitemap enviado en Google Search Console.
