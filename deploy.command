#!/bin/bash
set -e

echo ""
echo "Netlify Deploy startet"
echo ""

PROJECT_DIR="$HOME/Documents/drk-infodisplay"
PUBLISH_DIR="public"

SITE_ID="2909611f-f6ad-45f1-b81f-0e97a77c3098"
TOKEN_FILE="$HOME/.netlify_token_drk_display"

cd "$PROJECT_DIR" || { echo "Ordner nicht gefunden: $PROJECT_DIR"; read -n 1 -s; exit 1; }

if [ ! -d "$PUBLISH_DIR" ]; then
  echo "Publish Ordner fehlt: $PROJECT_DIR/$PUBLISH_DIR"
  read -n 1 -s
  exit 1
fi

if [ ! -f "$PUBLISH_DIR/index.html" ]; then
  echo "index.html fehlt in $PROJECT_DIR/$PUBLISH_DIR"
  read -n 1 -s
  exit 1
fi

if [ ! -f "$TOKEN_FILE" ]; then
  echo "Es fehlt dein Netlify Token."
  echo ""
  echo "So richtest du es einmalig ein"
  echo "1. Netlify öffnen, User settings, Applications, Personal access tokens"
  echo "2. Token erstellen und kopieren"
  echo "3. Dann im Terminal genau diese zwei Befehle ausführen"
  echo "   printf '%s' 'DEIN_TOKEN_HIER' > \"$TOKEN_FILE\""
  echo "   chmod 600 \"$TOKEN_FILE\""
  echo ""
  echo "Danach deploy.command erneut starten."
  read -n 1 -s
  exit 1
fi

NETLIFY_AUTH_TOKEN="$(tr -d '\r\n' < "$TOKEN_FILE")"

echo "Deploy läuft"
echo ""

npx -y netlify deploy \
  --prod \
  --dir "$PUBLISH_DIR" \
  --site "$SITE_ID" \
  --auth "$NETLIFY_AUTH_TOKEN" \
  --message "Manual deploy $(date '+%Y-%m-%d %H:%M')"

echo ""
echo "Deploy fertig. Du kannst das Fenster schließen."
read -n 1 -s
