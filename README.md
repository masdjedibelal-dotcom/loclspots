# LoclSpots

Die Community-App für Menschen 30+: thematische Chatrooms, kuratierte Listen (Collabs) und gemeinsame Events – um echte Verbindungen zu schaffen.

## Tech Stack

- **Next.js** (App Router)
- **Supabase** (Auth, PostgreSQL, Realtime)
- **Tailwind CSS**

## Setup

1. **Repository klonen**
   ```bash
   git clone <repo-url>
   cd loclspots
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen anlegen**
   - Kopiere `.env.example` nach `.env.local`
   - Trage `NEXT_PUBLIC_SUPABASE_URL` und `NEXT_PUBLIC_SUPABASE_ANON_KEY` aus dem Supabase Dashboard ein

4. **Supabase-Datenbank einrichten**
   - Neues Projekt im [Supabase Dashboard](https://supabase.com/dashboard) erstellen
   - Im SQL Editor nacheinander ausführen:
     - `supabase/schema.sql` (Tabellen, Views, Indexes, Seed)
     - `supabase/rls-policies.sql` (Row Level Security)
     - optional: `supabase/collab-likes.sql` (Likes-Feature)

5. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

## Entwicklung

- `npm run dev` – Dev-Server mit Hot Reload
- `npm run build` – Production Build
- `npm run start` – Production Server starten (nach Build)
- `npm run lint` – ESLint ausführen

## Deployment auf Vercel

### 1. Supabase Production-Einstellungen

**Authentication → URL Configuration**

1. **Site URL** auf deine Vercel-Domain setzen  
   z.B. `https://loclspots.vercel.app` oder `https://deine-custom-domain.de`  
   → Wird für Redirects nach Login/Logout verwendet

2. **Redirect URLs** hinzufügen  
   Alle URLs, die Supabase Auth als Callback-Ziele nutzt:
   - `https://deine-app.vercel.app/**` (Wildcard für alle Pfade)
   - `https://deine-app.vercel.app/auth/callback` (falls du einen speziellen Callback-Route nutzt)

   → Ohne diese URLs landen Nutzer nach der Anmeldung ggf. auf einer Fehlerseite

**E-Mail-Templates (optional)**  
Unter Authentication → Email Templates: Bestätigungsmail, Passwort-Reset etc. auf Deutsch anpassen.

### 2. Vercel Deployment

**Option A: GitHub-Verbindung**

1. Projekt auf GitHub pushen
2. In [vercel.com](https://vercel.com) → New Project → Repository verbinden
3. **Environment Variables** setzen:
   - `NEXT_PUBLIC_SUPABASE_URL` = deine Supabase-URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = dein Supabase Anon Key
4. Deploy starten (automatisch bei jedem Push)

**Option B: Vercel CLI**

```bash
npm i -g vercel
vercel login
vercel
```

Beim ersten Aufruf: Projekt-Link, Environment Variables eintragen.  
Für Production: `vercel --prod`

### Hinweise

- Nur `NEXT_PUBLIC_*` Variablen werden clientseitig genutzt – alle anderen bleiben serverseitig
- Nach Änderungen an Env-Vars in Vercel: Redeploy auslösen
