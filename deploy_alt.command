#!/bin/bash
set -e

cd "$HOME/Documents/drk-infodisplay"

echo ""
echo "Netlify Deploy startet"
echo ""

# Diese Variablen können den Deploy auf eine falsche Site lenken
unset NETLIFY_AUTH_TOKEN
unset NETLIFY_API_TOKEN
unset NETLIFY_SITE_ID

echo "Deploy läuft"
echo ""

# Wichtig: Site Id fest vorgeben, damit es immer die richtige Seite trifft
npx -y netlify deploy --prod --site "2909611f-f6ad-45f1-b81f-0e97a77c3098"

echo ""
echo "Deploy erfolgreich."
echo ""
read -n 1 -s -r -p "Taste drücken zum Schließen"
echo ""
