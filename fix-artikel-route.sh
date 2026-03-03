#!/bin/bash
# Entfernt doppelte (app)/artikel Route für Netlify-Build
# Im Repo-Root ausführen: ./fix-artikel-route.sh

set -e

# Einzelne Datei entfernen (falls vorhanden)
git rm -f "src/app/(app)/artikel/page.tsx" 2>/dev/null || true

# Kompletten Ordner entfernen (inkl. [slug] falls doppelt)
git rm -rf "src/app/(app)/artikel/" 2>/dev/null || true

# Leeren Ordner committen
git status
echo ""
echo "Führe aus: git commit -m 'Remove duplicate (app)/artikel route'"
echo "Dann: git push"
