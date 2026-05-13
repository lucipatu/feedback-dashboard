# CapyFi Feedback Intelligence Dashboard

Un dashboard interno para centralizar, analizar y visualizar el feedback de usuarios de CapyFi usando inteligencia artificial.

## ¿Qué hace?

Cada vez que recibimos feedback de usuarios (Twitter, Discord, mail, etc.), lo cargamos en el dashboard y una IA lo analiza automáticamente:

- **Sentimiento** — positivo, negativo o neutral
- **Categorización** — UX, pricing, onboarding, bugs, etc.
- **Insight accionable** — una recomendación generada automáticamente por IA

El resultado es visibilidad en tiempo real sobre cómo se sienten los usuarios, qué temas mencionan más y cómo evoluciona el sentimiento en el tiempo.

## Stack

- **Frontend:** Next.js
- **Base de datos:** Supabase
- **IA:** API de Anthropic (Claude)
- **Deploy:** Vercel
- **Auth:** Login protegido para resguardar los datos

## Configuración

### 1. Cloná el repositorio

```bash
git clone https://github.com/tu-usuario/feedback-dashboard.git
cd feedback-dashboard
```

### 2. Instalá las dependencias

```bash
npm install
```

### 3. Configurá las variables de entorno

Copiá el archivo de ejemplo y completá con tus credenciales:

```bash
cp .env.example .env
```

Editá el archivo `.env` con tus valores:

```env
# ── Anthropic ─────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY=tu-api-key-de-anthropic

# ── Supabase ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-publica
```

### 4. Configurá la base de datos

Ejecutá el schema en tu proyecto de Supabase. Encontrás el archivo en:

```
supabase-schema.sql
```

### 5. Corré el proyecto localmente

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

## Deploy

El proyecto está pensado para deployarse en [Vercel](https://vercel.com). Conectá el repo y agregá las variables de entorno desde el panel de Vercel.
