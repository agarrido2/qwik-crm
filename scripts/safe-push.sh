#!/bin/bash

# Script para hacer push seguro a GitHub evitando archivos .env
# Uso: ./scripts/safe-push.sh "mensaje del commit"

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Verificando estado del repositorio...${NC}"

# Verificar si estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: No estás en un repositorio Git${NC}"
    exit 1
fi

# Verificar si hay cambios para commitear
if git diff --cached --quiet && git diff --quiet; then
    echo -e "${YELLOW}ℹ️  No hay cambios para commitear${NC}"
    exit 0
fi

# Mensaje del commit (usar parámetro o pedir al usuario)
if [ -z "$1" ]; then
    echo -e "${YELLOW}💬 Introduce el mensaje del commit:${NC}"
    read -r COMMIT_MESSAGE
else
    COMMIT_MESSAGE="$1"
fi

# Verificar que .env está en .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Agregando .env a .gitignore...${NC}"
    echo ".env" >> .gitignore
fi

# Remover .env del staging si está presente
if git ls-files --cached | grep -q "^\.env$"; then
    echo -e "${YELLOW}🧹 Removiendo .env del staging area...${NC}"
    git rm --cached .env
fi

# Verificar archivos que se van a commitear
echo -e "${YELLOW}📁 Archivos que se van a commitear:${NC}"
git diff --cached --name-only

# Verificar que no hay secretos obvios
echo -e "${YELLOW}🔐 Verificando secretos...${NC}"
SECRETS_FOUND=false

# Buscar patrones de secretos en archivos staged
for file in $(git diff --cached --name-only); do
    if [ -f "$file" ]; then
        # Buscar patrones comunes de secretos
        if grep -q -E "(CLIENT_ID|CLIENT_SECRET|API_KEY|SECRET_KEY|PRIVATE_KEY|PASSWORD)" "$file" 2>/dev/null; then
            echo -e "${RED}⚠️  Posibles secretos encontrados en: $file${NC}"
            SECRETS_FOUND=true
        fi
    fi
done

if [ "$SECRETS_FOUND" = true ]; then
    echo -e "${RED}❌ Se encontraron posibles secretos. Revisa los archivos antes de continuar.${NC}"
    echo -e "${YELLOW}¿Continuar de todos modos? (y/N):${NC}"
    read -r CONTINUE
    if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}❌ Push cancelado${NC}"
        exit 1
    fi
fi

# Hacer add de todos los cambios (excepto .env que ya está ignorado)
echo -e "${YELLOW}➕ Agregando cambios...${NC}"
git add .

# Hacer commit
echo -e "${YELLOW}💾 Haciendo commit...${NC}"
git commit -m "$COMMIT_MESSAGE"

# Hacer push
echo -e "${YELLOW}🚀 Haciendo push a GitHub...${NC}"
if git push; then
    echo -e "${GREEN}✅ Push completado exitosamente!${NC}"
else
    echo -e "${RED}❌ Error en el push. Revisa los mensajes anteriores.${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 ¡Proceso completado!${NC}"
