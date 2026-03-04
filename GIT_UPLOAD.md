# Git-Upload: "Something went really wrong"

## Problem
GitHub-Web-Upload schlägt fehl bei `app` und `components` – oft wegen:
- Ordnernamen mit Klammern: `(app)`, `(public)`, `(auth)`
- Dateigrößen / Timeout
- Browser-Cache oder Erweiterungen

## Empfohlene Lösung: Git im Terminal nutzen

```bash
# 1. Ins Projektverzeichnis
cd /Users/belalmasdjedi/Desktop/loclspots

# 2. Git initialisieren (falls noch nicht)
git init

# 3. Remote hinzufügen (falls noch nicht)
git remote add origin https://github.com/DEIN-USERNAME/loclspots.git

# 4. Nur gewünschte Dateien hinzufügen (ohne .next, node_modules)
git add src/ public/ package.json package-lock.json netlify.toml tsconfig.json next.config.* tailwind.config.* postcss.config.* .gitignore

# 5. Oder alles außer Ignoriertes
git add .
git status   # Prüfen: .next und node_modules sollten NICHT dabei sein

# 6. Commit
git commit -m "Add app and components"

# 7. Push
git push -u origin main
```

## Alternative: Kleine Batches pushen

Falls der Push immer noch fehlschlägt:

```bash
git add src/app
git commit -m "Add app directory"
git push

git add src/components
git commit -m "Add components directory"
git push
```

## Prüfen vor dem Push

```bash
# Sollen NICHT in der Liste erscheinen:
# .next/, node_modules/, .env.local
git status
```

## Wenn du die GitHub-Web-Oberfläche nutzt

1. **Ordner einzeln hochladen** statt den ganzen Projektordner
2. **Neuen Browser** oder Inkognito-Modus testen
3. **Kein Drag & Drop für (app)** – Klammern können Probleme machen
4. Besser: **Git CLI** wie oben nutzen
