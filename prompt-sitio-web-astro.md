# Prompt para Gemini Flash — Sitio Web Personal (Astro)

> Instrucción: pega este documento completo como prompt inicial. El proyecto Astro ya está inicializado (`npm create astro@latest`); construye dentro de esa estructura existente.

---

## 0. Contexto del proyecto

Eres un desarrollador frontend senior construyendo el sitio web personal de un desarrollador backend/DevOps. El sitio debe verse **minimalista, técnico y serio** — la referencia estética es el sitio y la app de **Cursor** (cursor.com): grafito oscuro, tipografía limpia, mucho espacio en blanco (negativo), casi monocromático, sin gradientes llamativos ni ilustraciones genéricas de stock.

**No uses:** emojis en el UI, iconos de librerías genéricas tipo "flaticon", tarjetas con sombras pesadas, gradientes tipo SaaS-genérico (morado-azul), ilustraciones 3D o blobs decorativos.

---

## 1. Paleta de colores (decidida — no la cambies)

Usamos grafito oscuro (no negro puro) con acento cian/petróleo heredado del branding personal del CV, en vez de blanco y negro plano.

```css
--bg-base: #0D0D0F;        /* fondo principal */
--bg-surface: #18181B;     /* tarjetas, secciones elevadas */
--bg-surface-hover: #202024;
--border: #2A2A2E;
--border-subtle: #1F1F23;

--text-primary: #FAFAFA;
--text-secondary: #A1A1AA;
--text-muted: #6E6E76;

--accent: #4FB3C4;         /* petróleo/cian, deriva del #0f4c5c del CV, aclarado para modo oscuro */
--accent-dim: #33707C;
--accent-text-on: #0D0D0F; /* texto sobre botones de acento */
```

Modo: **solo dark mode** en v1 (no construyas light mode, no agregues toggle).

---

## 2. Tipografía

- **Sans (UI, cuerpo, títulos):** Inter o Geist Sans (usa `@fontsource` o Google Fonts vía `<link>` — la que esté disponible sin fricción).
- **Mono (labels, tags de tecnologías, números, código):** JetBrains Mono o Geist Mono.
- Escala tipográfica sugerida (usa `clamp()` para responsive):
  - H1: 2.75rem → 4rem
  - H2: 1.75rem → 2.5rem
  - H3: 1.25rem → 1.5rem
  - Body: 1rem, line-height 1.6
  - Small/labels: 0.8125rem, letter-spacing 0.02em, uppercase para labels de categoría

---

## 3. Arquitectura de contenido (Content Collections)

Crea una content collection `projects` en `src/content/projects/` con schema en `src/content/config.ts`:

```
title: string
tag: enum ["Proyecto personal", "Proyecto académico", "Proyecto de infraestructura"]
summary: string (1-2 líneas)
role: string (ej. "Fundador y desarrollador único")
stack: string[]
highlights: string[] (bullets de logros, no de tareas)
githubUrl: string (opcional)
liveUrl: string (opcional)
order: number (para ordenar manualmente en Home/Projects)
```

Crea 3 entradas iniciales con este contenido real (no inventes proyectos nuevos):

1. **Neversion** — SaaS de reventa de credenciales digitales. Tag: Proyecto personal. Stack: Java, Spring Boot (hexagonal), Angular, Docker, GitHub Actions, AWS (ECR/EC2/Parameter Store), Dokploy, PostgreSQL/Supabase, Nginx.
2. **OrionTicket** — plataforma multi-tenant de venta de boletos. Tag: Proyecto académico. Stack: Java, Spring Boot, RabbitMQ, Spring Cloud Gateway, Docker Compose, Angular.
3. **Arquitectura Multi-VPS con Spring Cloud** — infraestructura distribuida con observabilidad. Tag: Proyecto de infraestructura. Stack: Spring Cloud (Config Server, Eureka, API Gateway), Tailscale WireGuard, PostgreSQL/Patroni/etcd/pgBouncer, Grafana Cloud (Prometheus/Loki/Tempo).

(El texto exacto de los bullets/highlights de cada proyecto te lo paso yo por separado antes de que generes el contenido final — por ahora usa placeholders `[[HIGHLIGHT]]` si no los tienes.)

---

## 4. Mapa del sitio (páginas)

Sitio de una sola página larga (single-page, con anclas) **más** páginas de detalle de proyecto individuales. No hagas un sitio multi-página tradicional con navegación compleja — el patrón es "landing técnica con secciones + case studies enlazados".

### 4.1 `/` (Home)
Secciones en este orden:

1. **Hero** — Nombre, rol ("Desarrollador Backend · DevOps & CI/CD"), una línea de una frase de posicionamiento (no un párrafo largo), 2 CTAs: "Ver proyectos" (ancla) y "Descargar CV" (link a PDF en `/public/cv.pdf`). Incluye enlaces a GitHub y LinkedIn como iconos pequeños, no botones grandes.
2. **Sobre mí** — 1 párrafo corto (reusa el tono del perfil profesional del CV: estudiante de Ingeniería en Sistemas 4to año, backend con experiencia práctica en DevOps/infraestructura propia). Sin foto grande — si acaso, una foto pequeña circular junto al hero, no una sección aparte tipo "About Us" corporativo.
3. **Proyectos** — grid o lista vertical de tarjetas, una por cada entrada de la content collection. Cada tarjeta: título, tag (badge), summary, 3-4 tecnologías clave (no todas), link "Ver detalle →". Click lleva a `/proyectos/[slug]`.
4. **Stack técnico** — dos columnas o dos grupos claramente diferenciados visualmente (no solo un heading, usa un badge o indicador visual distinto):
   - **"En producción"**: Java, Spring Boot, Angular, Docker, CI/CD (GitHub Actions), AWS, PostgreSQL, RabbitMQ, Grafana Cloud, Tailscale, React Native, Python, C++
   - **"En estudio activo"**: Kubernetes, Terraform, Kafka, Redis, MongoDB, GraphQL, Event Sourcing/CQRS, Saga Pattern, Circuit Breaker, OAuth2/OIDC, Testcontainers, k6, GCP, Azure, ELK Stack, Rust
   
   Usa tags/pills con la fuente monospace, no párrafos de texto corrido.
5. **Contacto** — email, LinkedIn, GitHub, ubicación (Guatemala — remoto). CTA final simple, sin formulario de contacto (evita backend innecesario en v1 — solo mailto: y links directos).

Footer minimalista: nombre, año, links repetidos en pequeño.

### 4.2 `/proyectos/[slug]` (Detalle de proyecto — página dinámica desde la collection)
Estructura:
1. Header: título, tag, rol, stack completo como pills
2. Contexto/problema (1 párrafo)
3. Highlights/logros (bullets, reusa `highlights` del content collection)
4. Diagrama o estructura si aplica (deja un placeholder de imagen `/images/proyectos/[slug]-diagram.png`, no generes el diagrama)
5. Links: GitHub, demo si existe
6. Botón "← Volver a proyectos"

---

## 5. Componentes a crear

- `Header.astro` — logo/inicial + nav de anclas (Proyectos, Stack, Contacto) + botón CV
- `Hero.astro`
- `ProjectCard.astro`
- `ProjectDetailLayout.astro`
- `TechBadge.astro` — pill reutilizable para tecnologías, variante `solid` (en producción) y `outline` (en estudio)
- `SectionHeading.astro` — heading con label pequeño arriba (estilo "eyebrow text") + título grande
- `Footer.astro`
- `SocialLinks.astro`

---

## 6. Requisitos técnicos no negociables

1. **Rendimiento**: usa `astro:assets` para cualquier imagen, lazy loading por defecto, sin JS innecesario (esto es un sitio estático — no uses React/Vue islands salvo que un componente realmente necesite interactividad, y ni siquiera el nav lo necesita).
2. **Accesibilidad**: contraste AA mínimo entre `--text-secondary` y `--bg-base` (verifícalo), `alt` en todas las imágenes, jerarquía semántica de headings correcta (un solo `h1` por página).
3. **SEO básico**: meta title/description por página, Open Graph tags, favicon, `sitemap.xml` (usa `@astrojs/sitemap`).
4. **Responsive**: mobile-first, breakpoints estándar (640px, 768px, 1024px, 1280px). El grid de proyectos pasa de 1 columna (mobile) a 2-3 (desktop).
5. **Sin dependencias innecesarias**: no instales librerías de UI completas (no Tailwind UI kits, no shadcn a menos que ya esté en el proyecto). CSS plano con variables o Tailwind (si el proyecto ya lo tiene configurado) está bien.

---

## 7. Tono de copywriting

- Directo, técnico, sin frases de relleno tipo "apasionado por la tecnología" o "team player".
- Primera persona, español neutro/latam.
- Los bullets de proyectos empiezan con verbo en primera persona pasado (Diseñé, Implementé, Configuré) — no "Responsable de..." ni infinitivos.

---

## 8. Orden de ejecución sugerido para ti (Gemini)

1. Configura tokens de diseño (colores, tipografía) en `src/styles/global.css` o `tailwind.config` según corresponda.
2. Crea el content collection de proyectos con las 3 entradas.
3. Construye los componentes base (Header, Footer, TechBadge, SectionHeading).
4. Construye Home (`/`) sección por sección, en el orden de la sección 4.1.
5. Construye la página dinámica de detalle de proyecto.
6. Aplica SEO/meta tags y sitemap.
7. Revisa responsive en mobile antes de dar por terminado.

Si algo de este documento es ambiguo, prioriza el criterio de "menos es más" — es preferible una sección simple y bien ejecutada que una compleja a medias.
