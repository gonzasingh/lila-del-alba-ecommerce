#!/usr/bin/env bash
# Aplica la Pre-entrega 2 sobre tu repositorio como una serie de commits.
# Uso: ubicate en la RAÍZ de tu repo (donde está package.json) y ejecutá:
#   bash /ruta/a/pre-entrega-2/aplicar-pre-entrega-2.sh
# Los commits quedan a tu nombre (usa tu git config user.name / user.email).

set -euo pipefail

AQUI="$(cd "$(dirname "$0")" && pwd)"
ETAPAS="$AQUI/stages"

# --- Chequeos previos ---
if [ ! -f package.json ] || ! grep -q '"name": "lila-del-alba-ecommerce"' package.json; then
  echo "❌ Ejecutá este script desde la raíz del repo lila-del-alba-ecommerce (donde está package.json)."
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Tenés cambios sin commitear. Hacé commit o git stash y volvé a ejecutar."
  exit 1
fi
if [ ! -f src/components/Header.jsx ]; then
  echo "❌ No encuentro src/components/Header.jsx: este script espera el repo tal como quedó en la Pre-entrega 1."
  exit 1
fi

BASE="$(git branch --show-current)"
RAMA="pre-entrega-2"

git switch -c "$RAMA"

aplicar() { # $1 = número de etapa, $2 = mensaje del commit
  cp -R "$ETAPAS/$1/." .
  git add -A
  git commit -q -m "$2"
  echo "✔ $2"
}

# 1. Identidad de marca: favicon, título y paleta
git rm -q public/favicon.svg
aplicar 01 "Actualizo favicon, título y paleta de colores con la identidad de Lila del Alba"

# 2. CartWidget
aplicar 02 "Agrego componente CartWidget con ícono de carrito y contador estático"

# 3. Navbar
aplicar 03 "Creo componente Navbar con logo, categorías de productos y CartWidget"

# 4. ItemListContainer
aplicar 04 "Creo componente ItemListContainer que muestra el greeting recibido por props"

# 5. App: ensamblado y limpieza
git rm -q src/components/Header.jsx
aplicar 05 "Ensamblo Navbar e ItemListContainer en App y elimino el Header inicial"

# 6. README (se completa tu usuario de GitHub si el repo ya tiene remote origin)
cp "$ETAPAS/06/README.md" README.md
if URL="$(git remote get-url origin 2>/dev/null)"; then
  USUARIO="$(printf '%s' "$URL" | sed -E 's#.*github\.com[:/]([^/]+)/.*#\1#')"
  if [ -n "$USUARIO" ] && [ "$USUARIO" != "$URL" ]; then
    sed -i.bak "s#TU-USUARIO#$USUARIO#g" README.md && rm -f README.md.bak
  fi
fi
git add -A
git commit -q -m "Actualizo README con la descripción de los componentes creados"
echo "✔ Actualizo README con la descripción de los componentes creados"

# Merge a la rama principal
git switch "$BASE"
git merge --no-ff "$RAMA" -m "Merge de pre-entrega-2: estructura de componentes y layout inicial"

echo
echo "✅ Listo. Ahora probá la app (npm install && npm run dev) y subí los cambios:"
echo "   git push origin $BASE"
git log --oneline -n 8
