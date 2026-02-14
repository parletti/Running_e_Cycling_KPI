#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
echo "Avvio server su http://localhost:8080"

if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server 8080
elif command -v ruby >/dev/null 2>&1; then
  ruby -run -e httpd . -p 8080
else
  echo "Errore: non trovo python3 o ruby per avviare il server."
  exit 1
fi
