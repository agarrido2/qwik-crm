#!/bin/bash

# Script rápido para push seguro - versión simplificada
# Uso: ./scripts/quick-push.sh "mensaje del commit"

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Mensaje del commit
COMMIT_MESSAGE="${1:-"update: cambios automáticos"}"

echo -e "${YELLOW}🚀 Push rápido iniciado...${NC}"

# Asegurar que .env está ignorado
git rm --cached .env 2>/dev/null || true

# Add, commit y push en una sola operación
git add .
git commit -m "$COMMIT_MESSAGE"
git push

echo -e "${GREEN}✅ Push completado!${NC}"
