#!/usr/bin/env bash
# =============================================================================
# scripts/docker-build.sh – build the production image
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Building coalops:1.0 ..."
docker build -t coalops:1.0 -f Dockerfile .
echo "✓ Image built: coalops:1.0"
echo
echo "Run it with:"
echo "    docker run -d --name coalops -p 3000:3000 coalops:1.0"
echo "or with compose:"
echo "    docker compose up -d"
