#!/bin/zsh
set -e

cd "$(dirname "$0")"

echo "Deploy startet"

git add -A

if git diff --cached --quiet; then
  echo "Keine Änderungen."
else
  msg="Update $(date '+%Y-%m-%d %H:%M')"
  git commit -m "$msg"
fi

git push

echo "Fertig."
read -n 1 -s -r -p "Taste drücken zum Schließen"
echo
