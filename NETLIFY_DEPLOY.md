# Netlify Deploy

## Benötigte Umgebungsvariablen

Der Build schlägt fehl, wenn diese Variablen nicht gesetzt sind:

| Variable | Pflicht | Beschreibung |
|----------|---------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Ja | Supabase Project URL (z. B. `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Ja | Supabase Anon/Public Key |

## Einrichtung in Netlify

1. Netlify Dashboard → **Site settings** → **Build & deploy** → **Environment**
2. **Edit variables** oder **Add a variable**
3. Beide Variablen hinzufügen:
   - `NEXT_PUBLIC_SUPABASE_URL` = deine Supabase-URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = dein Anon-Key
4. Scope: **Builds** (für den Build) und ggf. **Deploy previews**
5. Nach dem Speichern: **Trigger deploy** → **Clear cache and deploy site**

## Wo finde ich die Werte?

Supabase Dashboard → **Project Settings** → **API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
